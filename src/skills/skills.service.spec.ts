import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Student } from 'src/accounts/entities/student.entity';
import { SkillTypes } from 'src/common/enums/skillsTypes';
import { Repository } from 'typeorm';
import { CreateSkillDto } from './dto/create-skill.dto';
import { Skill } from './entities/skill.entity';
import { SkillsService } from './skills.service';

const mockSkill = (overrides: Partial<Skill> = {}): Skill =>
  Object.assign(new Skill(), {
    id: 1,
    name: 'TypeScript',
    type: SkillTypes.Hard,
    students: [],
    ...overrides,
  });

const mockStudent = (overrides: Partial<Student> = {}): Student =>
  Object.assign(new Student(), { id: 'student-uuid-1', ...overrides });

describe('SkillsService', () => {
  let service: SkillsService;
  let repo: jest.Mocked<Repository<Skill>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillsService,
        {
          provide: getRepositoryToken(Skill),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            count: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            upsert: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SkillsService>(SkillsService);
    repo = module.get(getRepositoryToken(Skill));
  });

  afterEach(() => jest.clearAllMocks());

  describe('list', () => {
    it('retourne tout sans pagination quand per_page est absent', async () => {
      const skills = [mockSkill(), mockSkill({ id: 2, name: 'Jest' })];
      repo.find.mockResolvedValue(skills);

      const result = await service.list(1, undefined);

      expect(result).toEqual({ page: 1, pages: 1, list: skills });
      expect(repo.find).toHaveBeenCalledWith({ where: undefined });
      expect(repo.count).not.toHaveBeenCalled();
    });

    it('applique le filtre where sans pagination', async () => {
      repo.find.mockResolvedValue([]);

      await service.list(1, undefined, { type: SkillTypes.Soft });

      expect(repo.find).toHaveBeenCalledWith({
        where: { type: SkillTypes.Soft },
      });
    });

    it('calcule la pagination correctement', async () => {
      const skills = [mockSkill()];
      repo.count.mockResolvedValue(25);
      repo.find.mockResolvedValue(skills);

      const result = await service.list(2, 10);

      expect(result.pages).toBe(3);
      expect(result.page).toBe(2);
      expect(result.list).toBe(skills);
      expect(repo.find).toHaveBeenCalledWith({
        skip: 10,
        take: 10,
        where: undefined,
      });
    });

    it('arrondit vers le haut le nombre de pages', async () => {
      repo.count.mockResolvedValue(11);
      repo.find.mockResolvedValue([]);

      const result = await service.list(1, 10);

      expect(result.pages).toBe(2);
    });

    it('renvoie page 1 / pages 1 quand la liste est vide avec pagination', async () => {
      repo.count.mockResolvedValue(0);
      repo.find.mockResolvedValue([]);

      const result = await service.list(1, 10);

      expect(result.pages).toBe(0);
    });
  });

  describe('find', () => {
    it('retourne la skill trouvée', async () => {
      const skill = mockSkill();
      repo.findOneBy.mockResolvedValue(skill);

      const result = await service.find(1);

      expect(result).toBe(skill);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('retourne null si la skill est introuvable', async () => {
      repo.findOneBy.mockResolvedValue(null);

      const result = await service.find(99);

      expect(result).toBeNull();
    });
  });

  describe('asign', () => {
    it('assigne une skill existante à un étudiant via son id', async () => {
      const student = mockStudent();
      const skill = mockSkill({ students: [] });
      repo.findOneBy.mockResolvedValue(skill);
      repo.save.mockResolvedValue(skill);

      const result = await service.asign(1, student);

      expect(result).toBe(skill);
      expect(skill.students).toContain(student);
      expect(repo.save).toHaveBeenCalledWith(skill);
    });

    it("n'ajoute pas l'étudiant s'il possède déjà la skill", async () => {
      const student = mockStudent();
      const skill = mockSkill({ students: [student] });
      repo.findOneBy.mockResolvedValue(skill);

      await service.asign(1, student);

      expect(repo.save).not.toHaveBeenCalled();
      expect(skill.students).toHaveLength(1);
    });

    it('retourne une NotFoundException si la skill est introuvable par id', async () => {
      repo.findOneBy.mockResolvedValue(null);

      const result = await service.asign(99, mockStudent());

      expect(result).toBeInstanceOf(NotFoundException);
    });

    it('crée la skill via upsert si un DTO est fourni', async () => {
      const student = mockStudent();
      const dto: CreateSkillDto = { name: 'React', type: SkillTypes.Hard };
      const skill = mockSkill({ id: 5, name: 'React', students: [] });
      repo.upsert.mockResolvedValue({
        identifiers: [{ id: 5 }],
        generatedMaps: [],
        raw: [],
      });
      repo.findOneBy.mockResolvedValue(skill);
      repo.save.mockResolvedValue(skill);

      const result = await service.asign(dto, student);

      expect(repo.upsert).toHaveBeenCalledWith(dto, ['name', 'type']);
      expect(result).toBe(skill);
    });

    it('retourne une NotFoundException si le DTO upsert ne trouve pas la skill', async () => {
      const dto: CreateSkillDto = { name: 'Unknown', type: SkillTypes.Soft };
      repo.upsert.mockResolvedValue({
        identifiers: [{ id: 99 }],
        generatedMaps: [],
        raw: [],
      });
      repo.findOneBy.mockResolvedValue(null);

      const result = await service.asign(dto, mockStudent());

      expect(result).toBeInstanceOf(NotFoundException);
    });
  });

  describe('remove', () => {
    it("retire l'étudiant de la skill et sauvegarde si d'autres étudiants existent", async () => {
      const student = mockStudent({ id: 'student-1' });
      const other = mockStudent({ id: 'student-2' });
      const skill = mockSkill({ students: [student, other] });
      repo.findOneBy.mockResolvedValue(skill);
      repo.save.mockResolvedValue(skill);

      const result = await service.remove(1, student);

      expect(result).toBe(skill);
      expect(skill.students).not.toContain(student);
      expect(repo.save).toHaveBeenCalledWith(skill);
      expect(repo.delete).not.toHaveBeenCalled();
    });

    it('supprime la skill si plus aucun étudiant ne la possède', async () => {
      const student = mockStudent();
      const skill = mockSkill({ students: [student] });
      repo.findOneBy.mockResolvedValue(skill);

      await service.remove(1, student);

      expect(repo.delete).toHaveBeenCalledWith(skill.id);
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('retourne une NotFoundException si la skill est introuvable', async () => {
      repo.findOneBy.mockResolvedValue(null);

      const result = await service.remove(99, mockStudent());

      expect(result).toBeInstanceOf(NotFoundException);
      expect((result as NotFoundException).message).toBe('skill not found');
    });

    it("retourne une NotFoundException si l'étudiant ne possède pas la skill", async () => {
      const student = mockStudent({ id: 'other-student' });
      const skill = mockSkill({
        students: [mockStudent({ id: 'someone-else' })],
      });
      repo.findOneBy.mockResolvedValue(skill);

      const result = await service.remove(1, student);

      expect(result).toBeInstanceOf(NotFoundException);
      expect((result as NotFoundException).message).toBe(
        'student does not have the given skill',
      );
    });
  });
});

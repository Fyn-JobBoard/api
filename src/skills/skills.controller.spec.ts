import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from 'src/accounts/accounts.service';
import { Student } from 'src/accounts/entities/student.entity';
import { Auth } from 'src/auth/class/auth.class';
import { AccountTypes } from 'src/common/enums/accountTypes';
import { SkillTypes } from 'src/common/enums/skillsTypes';
import { CreateSkillDto } from './dto/create-skill.dto';
import { ListSkillsDto } from './dto/list-skills.response.dto';
import { Skill } from './entities/skill.entity';
import { SkillsController } from './skills.controller';
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

const mockAuth = (
  overrides: Partial<{ id: string; type: AccountTypes }> = {},
): Auth =>
  ({ id: 'student-uuid-1', type: AccountTypes.Student, ...overrides }) as Auth;

const mockListDto = (list: Skill[] = []): ListSkillsDto =>
  Object.assign(new ListSkillsDto(), { page: 1, pages: 1, list });

describe('SkillsController', () => {
  let controller: SkillsController;
  let skillsService: jest.Mocked<SkillsService>;
  let accountsService: jest.Mocked<AccountsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillsController],
      providers: [
        {
          provide: SkillsService,
          useValue: {
            list: jest.fn(),
            find: jest.fn(),
            asign: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: AccountsService,
          useValue: {
            findModel: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SkillsController>(SkillsController);
    skillsService = module.get(SkillsService);
    accountsService = module.get(AccountsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('get', () => {
    it('liste les skills sans filtre étudiant', async () => {
      const dto = mockListDto([mockSkill()]);
      skillsService.list.mockResolvedValue(dto);

      const result = await controller.get(
        1,
        20,
        undefined,
        undefined,
        undefined,
      );

      expect(result).toBe(dto);
      expect(skillsService.list).toHaveBeenCalledWith(1, 20, {
        name: undefined,
        type: undefined,
        students: undefined,
      });
    });

    it('utilise page=undefined quand page est NaN', async () => {
      skillsService.list.mockResolvedValue(mockListDto());

      await controller.get(NaN, 10);

      expect(skillsService.list).toHaveBeenCalledWith(
        undefined,
        10,
        expect.anything(),
      );
    });

    it('utilise per_page=20 par défaut quand per_page est NaN', async () => {
      skillsService.list.mockResolvedValue(mockListDto());

      await controller.get(1, NaN);

      expect(skillsService.list).toHaveBeenCalledWith(1, 20, expect.anything());
    });

    it('filtre par étudiant quand student_id est fourni', async () => {
      const student = mockStudent();
      accountsService.findModel.mockResolvedValue(student);
      skillsService.list.mockResolvedValue(mockListDto());

      await controller.get(1, 20, undefined, 'student-uuid-1', undefined);

      expect(accountsService.findModel).toHaveBeenCalledWith(
        'student-uuid-1',
        Student,
      );
      expect(skillsService.list).toHaveBeenCalledWith(
        1,
        20,
        expect.objectContaining({ students: student }),
      );
    });

    it('lève NotFoundException si student_id ne correspond à aucun étudiant', async () => {
      accountsService.findModel.mockResolvedValue(null);

      await expect(controller.get(1, 20, undefined, 'bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('filtre par name et type', async () => {
      skillsService.list.mockResolvedValue(mockListDto());

      await controller.get(1, 20, 'React', undefined, SkillTypes.Hard);

      expect(skillsService.list).toHaveBeenCalledWith(
        1,
        20,
        expect.objectContaining({ name: 'React', type: SkillTypes.Hard }),
      );
    });
  });

  describe('find', () => {
    it('retourne la skill trouvée', async () => {
      const skill = mockSkill();
      skillsService.find.mockResolvedValue(skill);

      const result = await controller.find(1);

      expect(result).toBe(skill);
    });

    it('lève NotFoundException si la skill est introuvable', async () => {
      skillsService.find.mockResolvedValue(null);

      await expect(controller.find(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('upsert', () => {
    const dto: CreateSkillDto = { name: 'React', type: SkillTypes.Hard };

    it("lève NotFoundException si l'étudiant est introuvable", async () => {
      accountsService.findModel.mockResolvedValue(null);

      await expect(
        controller.upsert(dto, mockAuth(), 'bad-student-id'),
      ).rejects.toThrow(NotFoundException);
    });

    it("lève UnauthorizedException si l'auth n'est ni admin ni l'étudiant lui-même", async () => {
      const student = mockStudent({ id: 'other-student' });
      accountsService.findModel.mockResolvedValue(student);
      const auth = mockAuth({
        id: 'student-uuid-1',
        type: AccountTypes.Student,
      });

      await expect(
        controller.upsert(dto, auth, 'other-student'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('lève InternalServerErrorException si plusieurs skills correspondent', async () => {
      const student = mockStudent();
      accountsService.findModel.mockResolvedValue(student);
      const auth = mockAuth({ type: AccountTypes.Admin });
      skillsService.list.mockResolvedValue(
        mockListDto([mockSkill(), mockSkill({ id: 2 })]),
      );

      await expect(controller.upsert(dto, auth, student.id)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('assigne la skill existante à un étudiant (auth = admin)', async () => {
      const student = mockStudent();
      const skill = mockSkill();
      accountsService.findModel.mockResolvedValue(student);
      const auth = mockAuth({ type: AccountTypes.Admin });
      skillsService.list.mockResolvedValue(mockListDto([skill]));
      skillsService.asign.mockResolvedValue(skill);

      const result = await controller.upsert(dto, auth, student.id);

      expect(skillsService.asign).toHaveBeenCalledWith(skill.id, student);
      expect(result).toBe(skill);
    });

    it('crée puis assigne la skill si aucune correspondance', async () => {
      const student = mockStudent();
      const skill = mockSkill();
      accountsService.findModel.mockResolvedValue(student);
      const auth = mockAuth({ id: student.id, type: AccountTypes.Student });
      skillsService.list.mockResolvedValue(mockListDto([]));
      skillsService.asign.mockResolvedValue(skill);

      await controller.upsert(dto, auth, student.id);

      expect(skillsService.asign).toHaveBeenCalledWith(dto, student);
    });

    it('propage une HttpException retournée par asign', async () => {
      const student = mockStudent();
      accountsService.findModel.mockResolvedValue(student);
      const auth = mockAuth({ type: AccountTypes.Admin });
      skillsService.list.mockResolvedValue(mockListDto([]));
      skillsService.asign.mockResolvedValue(new NotFoundException('not found'));

      await expect(controller.upsert(dto, auth, student.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('apply', () => {
    it("lève NotFoundException si l'étudiant est introuvable", async () => {
      accountsService.findModel.mockResolvedValue(null);

      await expect(controller.apply(1, mockAuth(), 'bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it("lève UnauthorizedException si l'auth n'est ni admin ni l'étudiant", async () => {
      const student = mockStudent({ id: 'other-student' });
      accountsService.findModel.mockResolvedValue(student);

      await expect(
        controller.apply(
          1,
          mockAuth({ id: 'someone-else', type: AccountTypes.Student }),
          student.id,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('applique la skill à un étudiant', async () => {
      const student = mockStudent();
      const skill = mockSkill();
      accountsService.findModel.mockResolvedValue(student);
      skillsService.asign.mockResolvedValue(skill);

      const result = await controller.apply(
        1,
        mockAuth({ id: student.id }),
        student.id,
      );

      expect(skillsService.asign).toHaveBeenCalledWith(1, student);
      expect(result).toBe(skill);
    });

    it('propage une HttpException retournée par asign', async () => {
      const student = mockStudent();
      accountsService.findModel.mockResolvedValue(student);
      skillsService.asign.mockResolvedValue(new NotFoundException());

      await expect(
        controller.apply(1, mockAuth({ id: student.id }), student.id),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it("lève NotFoundException si l'étudiant est introuvable", async () => {
      accountsService.findModel.mockResolvedValue(null);

      await expect(controller.remove(1, mockAuth(), 'bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it("lève UnauthorizedException si l'auth n'est ni admin ni l'étudiant", async () => {
      const student = mockStudent({ id: 'other-student' });
      accountsService.findModel.mockResolvedValue(student);

      await expect(
        controller.remove(
          1,
          mockAuth({ id: 'someone-else', type: AccountTypes.Student }),
          student.id,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("retire la skill d'un étudiant", async () => {
      const student = mockStudent();
      const skill = mockSkill();
      accountsService.findModel.mockResolvedValue(student);
      skillsService.remove.mockResolvedValue(skill);

      const result = await controller.remove(
        1,
        mockAuth({ id: student.id }),
        student.id,
      );

      expect(skillsService.remove).toHaveBeenCalledWith(1, student);
      expect(result).toBe(skill);
    });

    it('propage une HttpException retournée par remove', async () => {
      const student = mockStudent();
      accountsService.findModel.mockResolvedValue(student);
      skillsService.remove.mockResolvedValue(
        new NotFoundException('skill not found'),
      );

      await expect(
        controller.remove(1, mockAuth({ id: student.id }), student.id),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

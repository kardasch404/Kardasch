import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { IUserRepository } from '../repositories/user.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRole, UserStatus } from '../entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<IUserRepository>;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedPassword',
    firstName: 'Test',
    lastName: 'User',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    findById: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    findByEmail: jest.fn(),
    findByUsername: jest.fn(),
    findByEmailOrUsername: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'IUserRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get('IUserRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto: CreateUserDto = {
      email: 'new@example.com',
      username: 'newuser',
      password: 'password123',
    };

    it('should create a new user', async () => {
      repository.findByEmail.mockResolvedValue(null);
      repository.findByUsername.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockUser as any);

      const result = await service.create(createDto);

      expect(result.email).toBe(mockUser.email);
      expect(repository.findByEmail).toHaveBeenCalledWith(createDto.email);
      expect(repository.findByUsername).toHaveBeenCalledWith(createDto.username);
      expect(repository.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw ConflictException if email exists', async () => {
      repository.findByEmail.mockResolvedValue(mockUser as any);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if username exists', async () => {
      repository.findByEmail.mockResolvedValue(null);
      repository.findByUsername.mockResolvedValue(mockUser as any);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      repository.findById.mockResolvedValue(mockUser as any);

      const result = await service.findById(mockUser._id);

      expect(result.id).toBe(mockUser._id);
      expect(repository.findById).toHaveBeenCalledWith(mockUser._id);
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      repository.findAll.mockResolvedValue([mockUser] as any);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].email).toBe(mockUser.email);
      expect(repository.findAll).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const updateDto: UpdateUserDto = {
      firstName: 'Updated',
      lastName: 'Name',
    };

    it('should update user', async () => {
      const updatedUser = { ...mockUser, ...updateDto };
      repository.update.mockResolvedValue(updatedUser as any);

      const result = await service.update(mockUser._id, updateDto);

      expect(result.firstName).toBe(updateDto.firstName);
      expect(repository.update).toHaveBeenCalledWith(mockUser._id, updateDto);
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.update.mockResolvedValue(null);

      await expect(service.update('invalid-id', updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      repository.delete.mockResolvedValue(true);

      const result = await service.delete(mockUser._id);

      expect(result).toBe(true);
      expect(repository.delete).toHaveBeenCalledWith(mockUser._id);
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.delete.mockResolvedValue(false);

      await expect(service.delete('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('count', () => {
    it('should return user count', async () => {
      repository.count.mockResolvedValue(5);

      const result = await service.count();

      expect(result).toBe(5);
      expect(repository.count).toHaveBeenCalled();
    });
  });

  describe('updateLastLogin', () => {
    it('should update last login info', async () => {
      const ip = '127.0.0.1';
      repository.update.mockResolvedValue(mockUser as any);

      await service.updateLastLogin(mockUser._id, ip);

      expect(repository.update).toHaveBeenCalledWith(mockUser._id, expect.objectContaining({
        lastLoginIp: ip,
      }));
    });
  });
});

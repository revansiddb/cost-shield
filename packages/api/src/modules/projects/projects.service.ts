import crypto from 'crypto';

import { ProjectStatus } from '@costshield/shared';

import { Project } from '../../models';
import { generateApiKey } from '../../utils/apiKey';

export interface CreateProjectDTO {
  name: string;
  dailyBudget: number; // passed as raw integer string or number representing smallest unit
  monthlyBudget?: number;
  alertThreshold?: number;
}

export const projectsService = {
  /**
   * Generates slug securely to prevent conflicts
   */
  async generateUniqueSlug(name: string, userId: string): Promise<string> {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    let slug = baseSlug || 'project';

    // Check if user already has this slug locally
    let existing = await Project.findOne({ where: { userId, slug } });
    if (!existing) return slug;

    // Very naive conflict resolution tailored for single-owner MVP context
    slug = `${baseSlug}-${crypto.randomBytes(2).toString('hex')}`;
    return slug;
  },

  async createProject(userId: string, data: CreateProjectDTO) {
    const slug = await this.generateUniqueSlug(data.name, userId);
    const { rawKey, keyHash, keyPrefix } = generateApiKey();

    const project = await Project.create({
      userId,
      name: data.name,
      slug,
      status: ProjectStatus.ACTIVE,
      keyPrefix,
      apiKeyHash: keyHash,
      currencyCode: 'USD', // defaulting for now unless user preferences dictate otherwise
      dailyBudget: BigInt(data.dailyBudget),
      monthlyBudget: data.monthlyBudget ? BigInt(data.monthlyBudget) : null,
      alertThreshold: data.alertThreshold ?? 80,
    });

    return { project, rawKey };
  },

  async listProjects(userId: string) {
    const projects = await Project.findAll({
      where: { userId },
      attributes: [
        'id',
        'name',
        'status',
        'dailyBudget',
        'monthlyBudget',
        'alertThreshold',
        'keyPrefix',
        'currencyCode',
        'createdAt',
      ],
      order: [['createdAt', 'DESC']],
    });

    // BigInts must be cast/mapped safely for JSON serialization
    return projects.map((p) => ({
      ...p.get({ plain: true }),
      dailyBudget: Number(p.dailyBudget),
      monthlyBudget: p.monthlyBudget ? Number(p.monthlyBudget) : null,
    }));
  },

  async getProjectById(userId: string, projectId: string) {
    const project = await Project.findOne({
      where: { id: projectId, userId },
      attributes: [
        'id',
        'name',
        'status',
        'dailyBudget',
        'monthlyBudget',
        'alertThreshold',
        'keyPrefix',
        'currencyCode',
        'createdAt',
      ],
    });

    if (!project) return null;

    return {
      ...project.get({ plain: true }),
      dailyBudget: Number(project.dailyBudget),
      monthlyBudget: project.monthlyBudget ? Number(project.monthlyBudget) : null,
    };
  },
};

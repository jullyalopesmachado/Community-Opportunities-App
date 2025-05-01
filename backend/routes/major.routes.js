import express from 'express';
import { create, findAll } from '../controllers/major.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Majors
 *   description: API endpoints for managing majors
 */

/**
 * @swagger
 * /majors:
 *   post:
 *     summary: Create a new major
 *     tags: [Majors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Major created successfully
 */
router.post('/', create);

/**
 * @swagger
 * /majors:
 *   get:
 *     summary: Get all majors
 *     tags: [Majors]
 *     responses:
 *       200:
 *         description: List of all majors
 */
router.get('/', findAll);

export default router;


import { Request, Response } from 'express'
import { Prisma } from '../generated/prisma/client'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {
  loginBodyValidation,
  registerBodyValidation,
} from '../validations/authValidations'

type TRegister = Prisma.UserCreateInput & {
  confirmPassword: string
}
export const register = async (req: Request, res: Response) => {
  try {
    const body: TRegister = req.body
    const isValidBody = registerBodyValidation.validate(body)
    if (isValidBody.error) {
      return res.status(400).json({
        message: isValidBody.error.message,
      })
    }
    const userExists = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    })

    if (userExists) {
      return res.status(400).json({
        message: 'User already exists',
      })
    }

    if (body.password !== body.confirmPassword) {
      return res.status(400).json({
        message: 'Passwords do not match',
      })
    }
    const hashedPassword = await bcrypt.hash(body.password, 10)
    const user = await prisma.user.create({
      data: {
        fullname: body.fullname,
        email: body.email,
        password: hashedPassword,
        role: body.role,
      },
    })
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '7d',
      }
    )
    return res.status(201).json({
      message: 'User created successfully',
      data: user,
      token,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: 'Internal server error',
    })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const body = req.body
    const isValidBody = loginBodyValidation.validate(body)
    if (isValidBody.error) {
      return res.status(400).json({
        message: isValidBody.error.message,
      })
    }
    const { email, password } = body
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    if (!user) {
      return res.status(400).json({
        message: 'User not found',
      })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({
        message: 'Invalid password',
      })
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '7d',
      }
    )
    return res.status(200).json({
      message: 'User logged in successfully',
      data: user,
      token,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: 'Internal server error',
    })
  }
}

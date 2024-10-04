import { NextFunction, Request, Response } from 'express'
import logging from '../config/logging'
import Blog from '../models/blogModel'
import mongoose from 'mongoose'

const create = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Attempting to create blog ...')
    
    const { author, title, content, headline, picture } = req.body

    if (!author || !title || !content) {
        return res.status(400).json({ message: 'Author, title, and content are required.' })
    }

    try {
        const blog = new Blog({
            _id: new mongoose.Types.ObjectId(),
            author,
            title,
            content,
            headline,
            picture
        })

        const newBlog = await blog.save()
        logging.info('New blog created')
        return res.status(201).json({ blog: newBlog })
    } catch (error) {
        if (error instanceof Error) {
            logging.error(error.message)
            return res.status(500).json({ message: error.message })
        }
        logging.error('Unknown error occurred')
        return res.status(500).json({ message: 'An unknown error occurred' })
    }
}

const read = async (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.blogID
    logging.info(`Incoming read for blog with id ${_id}`)

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ error: 'Invalid blog ID.' })
    }

    try {
        const blog = await Blog.findById(_id).populate('author').exec()
        if (blog) {
            return res.status(200).json({ blog })
        } else {
            return res.status(404).json({ error: 'Blog not found.' })
        }
    } catch (error) {
        if (error instanceof Error) {
            logging.error(error.message)
            return res.status(500).json({ error: error.message })
        }
        logging.error('Unknown error occurred')
        return res.status(500).json({ error: 'An unknown error occurred' })
    }
}

const readAll = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Returning all blogs')
    
    const { page = 1, limit = 10 } = req.query
    try {
        const blogs = await Blog.find()
            .populate('author')
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .exec()
            
        const count = await Blog.countDocuments()

        return res.status(200).json({
            count,
            page: Number(page),
            totalPages: Math.ceil(count / Number(limit)),
            blogs
        })
    } catch (error) {
        if (error instanceof Error) {
            logging.error(error.message)
            return res.status(500).json({ message: error.message })
        }
        logging.error('Unknown error occurred')
        return res.status(500).json({ message: 'An unknown error occurred' })
    }
}

const query = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Query route called')
    try {
        const blogs = await Blog.find(req.body).populate('author').exec()
        return res.status(200).json({
            count: blogs.length,
            blogs
        })
    } catch (error) {
        if (error instanceof Error) {
            logging.error(error.message)
            return res.status(500).json({ message: error.message })
        }
        logging.error('Unknown error occurred')
        return res.status(500).json({ message: 'An unknown error occurred' })
    }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
    logging.info('Update route called')

    const _id = req.params.blogID

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: 'Invalid blog ID.' })
    }
    try {
        const blog = await Blog.findById(_id).exec()
        if (blog) {
            blog.set(req.body)
            const savedBlog = await blog.save()
            logging.info(`Blog with id ${_id} updated`)
            return res.status(200).json({ blog: savedBlog })
        } else {
            return res.status(404).json({ message: 'Blog not found.' })
        }
    } catch (error) {
        if (error instanceof Error) {
            logging.error(error.message)
            return res.status(500).json({ message: error.message })
        }
        logging.error('Unknown error occurred')
        return res.status(500).json({ message: 'An unknown error occurred' })
    }
}

const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
    logging.warn('Delete route called')
    const _id = req.params.blogID

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: 'Invalid blog ID.' })
    }

    try {
        const blog = await Blog.findByIdAndDelete(_id).exec()
        if (blog) {
            return res.status(200).json({ message: 'Blog deleted' })
        } else {
            return res.status(404).json({ message: 'Blog not found.' })
        }
    } catch (error) {
        if (error instanceof Error) {
            logging.error(error.message)
            return res.status(500).json({ message: error.message })
        }
        logging.error('Unknown error occurred')
        return res.status(500).json({ message: 'An unknown error occurred' })
    }
}

export default {
    create,
    read,
    readAll,
    query,
    update,
    deleteBlog
}

import Joi from 'joi'

export const schemaGroup = Joi.object({
 groupName: Joi.string().min(5).max(100).required().messages({
  'string.min': 'At least 5 character!',
  'string.empty': 'Not group name yet!',
 }),

 desc: Joi.string().min(5).max(100).required().messages({
  'string.min': 'At least 5 character!',
  'string.empty': 'Not description yet!',
 }),

 members: Joi.array().min(1).required().messages({
  'array.min': 'At least 1 member!',
 }),
 linkAvatar: Joi.string().base64().required().messages({
  'string.empty': 'Not avatar yet!',
 }),
})

const data = {
 type: 'text',
 data: 'hello cac tinh yeu',
 title: 'giang sinh an lanh',
 color: {
  r: 255,
  g: 255,
  b: 255,
  a: 1,
 },
 idFolder: 45,
 remindAt: '01/01/2024 07:00 AM +07:00',
 nodePublic: 0,
 dueAt: '01/01/2024 07:00 AM +07:00',
 lock: '123456',
 pinned: false,
 linkNoteShare: '',
}

export const schemaNoteEdit = Joi.object({
 data: Joi.string().min(5).max(1000).required().messages({
  'string.min': 'At least 5 character!',
  'string.empty': 'Not content yet!',
 }),

 title: Joi.string().min(5).max(100).required().messages({
  'string.min': 'At least 5 character!',
  'string.empty': 'Not title yet!',
 }),

 notePublic: Joi.array().min(1).required().messages({
  'array.min': 'At least 1 member!',
 }),

 idFolder: Joi.number().integer().required().messages({
  'string.empty': 'Not folder yet!',
 }),

 lock: Joi.string().allow('').allow(null),

 remindAt: Joi.date().min('now').required().messages({
  'string.empty': 'Not remindAt yet!',
 }),

 color: Joi.object().required().messages({
  'string.empty': 'Not color yet!',
 }),

 pinned: Joi.boolean().required().messages({
  'string.empty': 'Not pinned yet!',
 }),
})

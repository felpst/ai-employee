import { Knowledge } from '@cognum/models';

export const checkPermissions = async (req, res, next) => {
  const userId = req['userId'];
  const knowledgeId = req.params.id;

  const knowledge = await Knowledge.findById(knowledgeId);

  if (
    req.method === 'PUT' &&
    (!knowledge.permissions || !knowledge.permissions.length)
  ) {
    if (String(knowledge.createdBy) === userId) {
      knowledge.permissions = [
        {
          userId: userId,
          permission: 'Editor',
        },
      ];
    }
    req.body = knowledge;
    next();
    return;
  }

  const permission = knowledge.permissions.find((p) => p.userId === userId);
  if (!permission || permission.permission !== 'Editor') {
    res
      .status(403)
      .send("You don't have permission to edit or delete this knowledge.");
    return;
  }

  next();
};

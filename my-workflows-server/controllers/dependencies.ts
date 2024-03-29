import { NextFunction, Request, Response } from "express";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { NotFoundError } from "../errors/notFoundError";
import { Dependency } from "../models/Dependency";

interface DependencyProps {
  taskID: bigint,
  dependencies: bigint  
}

export const createDependencies = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  function createRecord(dep: DependencyProps){
    return ({taskID: dep.taskID, dependencies: dep.dependencies})
  }
  console.log('dependencies body:', req.body);
  if(Array.isArray(req.body)){
    const deps = req.body.map(dep=> createRecord(dep))
    await Dependency.bulkCreate(req.body, {updateOnDuplicate: ['dependencies']});
  } else {
    await Dependency.create(createRecord(req.body))
  }
  res.send('Dependencies Updated!');
})

export const deleteDependencies = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const {taskID, dependencies}= req.body;
  const destroyedDeps = await Dependency.destroy({where: {taskID: taskID, dependencies: dependencies}});
  if (!destroyedDeps) {
    return next(new NotFoundError(`No task with id : ${taskID}`));
  }
  res.send('Dependencies deleted!');
})
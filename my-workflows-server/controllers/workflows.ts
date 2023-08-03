import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";
import { Workflow } from "../models/Workflow";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { NotFoundError } from "../errors/notFoundError";
import { TaskArgs, createTasksFromArgs } from "./tasks";

interface WorkflowArgs {
  name: string,
  description: string,
  owner: bigint,
  tasks?: TaskArgs[]
}

export const getWorkflows = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const workflows = await Workflow.findAll({
    where: {
      completedDate: { [Op.eq]: null }
    }
  })
  if (workflows.length === 0) {
    return next(new NotFoundError('No workflows found.'));
  }
  res.send(workflows);
})

export const createWorkflow = asyncWrapper(async (req: Request<{},{}, WorkflowArgs>, res: Response) => {
  const { tasks, ...summaryFields } = req.body;
  console.log("🚀 ~ file: workflows.ts:29 ~ createWorkflow ~ summaryFields:", summaryFields)
  
  function getDuration(): {} | {duration: string} {
    if(tasks){
      const duration = Math.max(...tasks?.map(task=> task.dueDay));
      const durationUnits = duration > 1 ? 'Days' : 'Day';
      return {duration: `${duration} ${durationUnits}` };
    }
    return {};
  }

  const workflow = await Workflow.create({
    ...getDuration(),
    status: 'Draft',
    ...summaryFields,
  });

  if(tasks){
    const tasksWithWorkflowID = tasks.map((task) => ({...task, workflowID: BigInt(workflow.dataValues.workflowID)}));
    await createTasksFromArgs(tasksWithWorkflowID)
  }

  res.json({ msg: 'Workflow created!' });
});

export const updateWorkFlow = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const { workflowID } = req.params;
  const workflow = await Workflow.update(
    { ...req.body },
    { where: { workflowID: workflowID } }
  )
  if (workflow[0] === 0) {
    return next(new NotFoundError('The workflow does not exist to update.'));
  }
  res.send({ msg: 'Workflow updated!' });
})

export const deleteWorkFlow = asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
  const { workflowID } = req.params;
  const workflow = await Workflow.destroy({ where: { workflowID: workflowID } });
  if (workflow === 0) {
    return next(new NotFoundError('The workflow does not exist to delete.'))
  }
  res.send({ msg: `Workflow ${workflowID} has been deleted.` });
})
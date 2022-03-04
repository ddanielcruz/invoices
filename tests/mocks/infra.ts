import { Queue } from 'bullmq'

export const makeQueue = (): Queue => {
  class QueueStub implements Partial<Queue> {
    async add(): Promise<any> {}
  }

  return new QueueStub() as any
}

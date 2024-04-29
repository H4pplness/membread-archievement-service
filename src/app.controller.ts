import { Controller, Get, Inject, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka, EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController implements OnModuleInit{

  @EventPattern('hello.send')
  getHello(hello : string) {
    console.log("REPLICATION : ",hello);
  }

  async onModuleInit() {
  }
}

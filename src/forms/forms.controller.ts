import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FormsService } from './forms.service';

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Get()
  async getForms() {
    return this.formsService.getForms();
  }

  @Get(':id')
  async getFormById(@Param('id') id: string) {
    return this.formsService.getFormById(id);
  }

  @Post()
  async createForm(@Body() data: any) {
    return this.formsService.createForm(data);
  }

  @Post(':id/responses')
  async submitResponse(@Param('id') id: string, @Body() data: any) {
    return this.formsService.submitResponse(id, data);
  }
}

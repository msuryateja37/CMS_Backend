import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { FormsService } from './forms.service';
import { CreateFormDto, CreateFormVersionDto, SubmitResponseDto } from './dto/create-form.dto';

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  // ── Forms ────────────────────────────────────────────────────────────────

  /** List all forms (with active-version metadata) */
  @Get()
  getForms() {
    return this.formsService.getForms();
  }

  /** Create a new form + first draft version */
  @Post()
  createForm(@Body() dto: CreateFormDto) {
    return this.formsService.createForm(dto);
  }

  /** Get a form with its active version (canvas rows) */
  @Get(':id')
  getFormById(@Param('id') id: string) {
    return this.formsService.getFormById(id);
  }

  /** Get the frozen schema of the active published version (hot render path) */
  @Get(':id/schema')
  getActiveSchema(@Param('id') id: string) {
    return this.formsService.getActiveSchema(id);
  }

  /** Get the active schema by human-readable slug */
  @Get('by-slug/:slug')
  getActiveSchemaBySlug(@Param('slug') slug: string) {
    return this.formsService.getActiveSchemaBySlug(slug);
  }

  // ── Versions ─────────────────────────────────────────────────────────────

  /** List all versions for a form */
  @Get(':id/versions')
  getVersions(@Param('id') id: string) {
    return this.formsService.getVersions(id);
  }

  /** Create a new draft version for an existing form */
  @Post(':id/versions')
  createVersion(@Param('id') formId: string, @Body() dto: CreateFormVersionDto) {
    return this.formsService.createVersion(formId, dto);
  }

  /** Publish a draft version — freezes schema, activates it */
  @Patch('versions/:versionId/publish')
  publishVersion(@Param('versionId') versionId: string) {
    return this.formsService.publishVersion(versionId);
  }

  /** Archive a published version */
  @Patch('versions/:versionId/archive')
  archiveVersion(@Param('versionId') versionId: string) {
    return this.formsService.archiveVersion(versionId);
  }

  /** Update a draft version's canvas (title, description, sections) without publishing */
  @Patch('versions/:versionId/canvas')
  updateCanvas(@Param('versionId') versionId: string, @Body() dto: CreateFormVersionDto) {
    return this.formsService.updateCanvas(versionId, dto);
  }

  // ── Responses ────────────────────────────────────────────────────────────

  /** Submit a response (auto-pins to the active published version) */
  @Post(':id/responses')
  submitResponse(@Param('id') formId: string, @Body() dto: SubmitResponseDto) {
    return this.formsService.submitResponse(formId, dto);
  }

  /** List paginated responses for a form */
  @Get(':id/responses')
  getResponses(
    @Param('id') formId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.formsService.getResponses(formId, page, limit);
  }

  /** Get a single response with schema context */
  @Get('responses/:responseId')
  getResponse(@Param('responseId') responseId: string) {
    return this.formsService.getResponse(responseId);
  }

  // ── Analytics ────────────────────────────────────────────────────────────

  /** Answer distribution for a question (indexed column scan) */
  @Get('analytics/question/:questionId')
  getQuestionAnalytics(@Param('questionId') questionId: string) {
    return this.formsService.getQuestionAnalytics(questionId);
  }

  // ── Legacy helpers (seeded forms by title keyword) ────────────────────────

  /** Get a published form by title keyword (e.g. 'disability', 'audit checklist') */
  @Get('search/by-title')
  getFormByTitleKeyword(@Query('q') keyword: string) {
    return this.formsService.getFormByTitleKeyword(keyword);
  }
}

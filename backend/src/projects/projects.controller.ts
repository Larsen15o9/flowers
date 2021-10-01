import { Body, Controller, Delete, Get, Param, Patch, Post, UnprocessableEntityException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { GatewayConfiguration } from './dto/gateway-configuration';
import { FlowGatewayService } from '../flow/flow-gateway.service';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService,
                private flowGatewayService: FlowGatewayService) {
    }

    @Post()
    create(@Body() createProjectDto: CreateProjectDto) {
        return this.projectsService.create(createProjectDto);
    }

    @Get()
    findAll() {
        return this.projectsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
        return this.projectsService.update(+id, updateProjectDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.projectsService.remove(+id);
    }

    @Post('/use/:id')
    async useProject(@Param('id') id: string):Promise<void> {
        try {
            const project = await this.projectsService.findOne(id);
            const configuration: GatewayConfiguration = project.gateway;
            this.flowGatewayService.configureDataSourceGateway(configuration)
        } catch (e) {
            const description = `Can not use project with id '${id}'`;
            throw new UnprocessableEntityException(e, description);
        }
    }
}

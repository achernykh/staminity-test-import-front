import { module } from "angular";

import CategoriesComponent from "./categories/categories.component";
import CategoryComponent from "./category/category.component";
import ReferenceComponent from "./reference.component";
import config from "./reference.config";
import { categoryCodeFilter } from "./reference.filters";
import ReferenceService from "./reference.service";
import TemplateComponent from "./template/template.component";
import TemplatesComponent from "./templates/templates.component";


export default module("staminity.reference", [])
    .service("ReferenceService", ReferenceService)
    .component("reference", ReferenceComponent)
    .component("categories", CategoriesComponent)
    .component("category", CategoryComponent)
    .component("templates", TemplatesComponent)
    .component("activityTemplate", TemplateComponent)
    .filter("categoryCode", categoryCodeFilter)
    .config(config)
    .name;
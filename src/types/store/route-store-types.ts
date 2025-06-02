import type {RouteLocationNormalizedLoadedGeneric} from "vue-router";

export type VisitedRoute = Pick<RouteLocationNormalizedLoadedGeneric, 'fullPath' | 'name' | 'meta' | 'path'>;
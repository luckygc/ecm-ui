import type {RouteLocationNormalizedLoadedGeneric} from "vue-router";

export type VisitedPage = Pick<RouteLocationNormalizedLoadedGeneric, 'fullPath' | 'name' | 'meta' | 'path'>;
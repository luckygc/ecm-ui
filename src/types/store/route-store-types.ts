import type {RouteLocationNormalizedLoadedGeneric} from "vue-router";

export type Page = Pick<RouteLocationNormalizedLoadedGeneric, 'fullPath' | 'name' | 'meta' | 'path'>;
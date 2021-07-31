export class AppResponse<T> {
  constructor(public data: T[], public msg: string, public code: number) {
	}
}

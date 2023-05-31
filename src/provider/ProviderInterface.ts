/*
 *
 * Copyright (c) 2023.. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 *  E-mail: cihan@chy.com.tr
 *  Github:https://github.com/cihan53/
 *
 */

export interface ProviderInterface {
    middleware(): void

    loadController(): void

    errorResponder(error: any, req: any, res: any, next: any): void

    errorHandler(err: any, req: any, res: any, next: any): void

    Start(): void

}

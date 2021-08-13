/*
 * Copyright (c) 2021. Chy Bilgisayar Bilisim
 * Author: Cihan Ozturk
 * E-mail: cihan@chy.com.tr
 * Github:https://github.com/cihan53/
 */

export interface AuthInterface{
    /**
     * Authenticates the current user.
     * @param User $user
     * @param Request $request
     * @param Response $response
     * @return IdentityInterface the authenticated user identity. If authentication information is not provided, null will be returned.
     * @throws UnauthorizedHttpException if authentication information is provided but is invalid.
     */
     authenticate(user, request, response);

    /**
     * Generates challenges upon authentication failure.
     * For example, some appropriate HTTP headers may be generated.
     * @param Response $response
     */
     challenge(response);

    /**
     * Handles authentication failure.
     * The implementation should normally throw UnauthorizedHttpException to indicate authentication failure.
     * @param Response $response
     * @throws UnauthorizedHttpException
     */
     handleFailure(response);
}
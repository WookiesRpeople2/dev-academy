use actix_web::{
    dev::{Service, ServiceRequest, ServiceResponse, Transform},
    web, Error as ActixError, HttpMessage, HttpResponse,
};
use futures::future::{ok, LocalBoxFuture, Ready};
use std::{rc::Rc, task::{Context, Poll}};

pub struct AuthMiddleware;

impl AuthMiddleware {
    pub fn new() -> Self {
        Self
    }
}

impl<S, B> Transform<S, ServiceRequest> for AuthMiddleware
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = ActixError> + 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = ActixError;
    type InitError = ();
    type Transform = AuthMiddlewareService<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ok(AuthMiddlewareService { service: Rc::new(service) })
    }
}

pub struct AuthMiddlewareService<S> {
    service: Rc<S>,
}

impl<S, B> Service<ServiceRequest> for AuthMiddlewareService<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = ActixError> + 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = ActixError;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    fn poll_ready(&self, cx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        self.service.poll_ready(cx)
    }

    fn call(&self, req: ServiceRequest) -> Self::Future {
        let srv = Rc::clone(&self.service);

        Box::pin(async move {
            let services = req
                .app_data::<web::Data<crate::service::AppServices>>()
                .ok_or_else(|| HttpResponse::InternalServerError().finish());
            let jwt_service = &services.unwrap().jwt_service;

            let token_cookie = req
                .cookie("auth_token")
                .ok_or_else(|| actix_web::error::ErrorUnauthorized("Missing auth-token cookie"))?;

            let token = token_cookie.value();

            let decrypted_token = jwt_service
                .decrypt_token(token)
                .map_err(|_| actix_web::error::ErrorUnauthorized("Invalid token"))?;

            let claims = jwt_service
                .verify_jwt(&decrypted_token)
                .map_err(|_| actix_web::error::ErrorUnauthorized("Invalid token"))?;

            req.extensions_mut().insert(claims);

            srv.call(req).await
        })
    }
}


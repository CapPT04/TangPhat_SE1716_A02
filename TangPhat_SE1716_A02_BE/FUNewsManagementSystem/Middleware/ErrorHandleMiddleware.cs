using System.Net;

public class ErrorHandleMiddleware
  {
      private readonly RequestDelegate _next;
      private readonly ILogger<ErrorHandleMiddleware> _logger;
      public ErrorHandleMiddleware(RequestDelegate next, ILogger<ErrorHandleMiddleware> logger)
      {
          _next = next;
          _logger = logger;
      }
      public async Task InvokeAsync(HttpContext context)
      {
          try
          {
              await _next(context);

              // Only handle errors if response hasn't started
              if (!context.Response.HasStarted)
              {
                  switch (context.Response.StatusCode)
                  {
                      case (int)HttpStatusCode.Unauthorized:
                          await WriteError(context, "HB40101", "Token missing or invalid", HttpStatusCode.Unauthorized);
                          break;

                      case (int)HttpStatusCode.Forbidden:
                          await WriteError(context, "HB40301", "Permission denied", HttpStatusCode.Forbidden);
                          break;
                      case (int)HttpStatusCode.NotFound:
                          await WriteError(context, "HB40401", "Resource not found", HttpStatusCode.NotFound);
                          break;
                  }
              }
          }
          catch (Exception ex)
          {
              _logger?.LogError(ex, "Unhandled exception: {Message}", ex.Message);
              await WriteError(context, "HB50001", "Internal server error", HttpStatusCode.InternalServerError);
          }
      }
      private async Task WriteError(HttpContext context, string errorCode, string message, HttpStatusCode statusCode)
      {
          if (context.Response.HasStarted)
          {
              _logger?.LogWarning("The response has already started. Cannot write error response. ErrorCode={ErrorCode} Message={Message}", errorCode, message);
              return;
          }

          context.Response.Clear();
          context.Response.ContentType = "application/json";

          var error = new
          {
              code = errorCode,
              message
          };

          await context.Response.WriteAsJsonAsync(error);
      }
  }
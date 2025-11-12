namespace BusinessObjects.DTOs
{
    public class ApiResponse<T>
    {
        public string Message { get; set; } = string.Empty;
        public int StatusCode { get; set; }
        public T? Data { get; set; }

        public static ApiResponse<T> Succeed(T data, string? message = null, int statusCode = 200)
        {
            return new ApiResponse<T>
            {
                Message = message ?? "Success",
                StatusCode = statusCode,
                Data = data
            };
        }

        public static ApiResponse<T> Fail(string message, int statusCode = 400)
        {
            return new ApiResponse<T>
            {
                Message = message,
                StatusCode = statusCode,
                Data = default
            };
        }
    }
}

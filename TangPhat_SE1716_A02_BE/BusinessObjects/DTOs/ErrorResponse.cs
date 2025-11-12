namespace BusinessObjects.DTOs
{
    public enum ErrorCode
    {
        HB40001,  //Missinginvalid input
        HB40101,  //Token missinginvalid
        HB40301,  //Permission denied
        HB40401,  //Resource not found
        HB50001   //Internal server error
    }

    public class ErrorResponse
    {
        public string Message { get; set; } = string.Empty;
        public int StatusCode { get; set; }
        public string Code { get; set; } = string.Empty;
        public object? Data { get; set; }

        public static ErrorResponse Fail(ErrorCode code, string message, int statusCode = 400)
        {
            return new ErrorResponse
            {
                Message = message,
                StatusCode = statusCode,
                Code = code.ToString(),
                Data = null
            };
        }
    }
}
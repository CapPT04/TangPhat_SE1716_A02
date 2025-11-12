using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public interface IJWTService
    {
        string GenerateToken(int accountId, string name, string email, int? role);
    }
}

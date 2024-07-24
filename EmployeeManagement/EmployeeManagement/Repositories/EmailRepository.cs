using EmployeeManagement.Interfaces;
using MimeKit;
using MailKit.Net.Smtp;
using EmployeeManagement.DTO;

namespace EmployeeManagement.Repositories
{
    public class EmailRepository : IEmailRepository
    {
        private readonly IConfiguration _configuration;
        public EmailRepository(IConfiguration configuration) 
        {
            _configuration = configuration;
        }

        public async Task SendEmail(EmailRequestDTO request)
        {
            Console.WriteLine("Email Repository Send Email Executing:");
            var mail = "simsekemre63@gmail.com";
            var pw = "aiea cfea vsqt gvoo";

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Employement Management App", mail));
            message.To.Add(new MailboxAddress("Recipient Name", request.To));
            message.Subject = request.Subject;

            message.Body = new TextPart("plain")
            {
                Text = request.Message
            };

            SmtpClient client = new SmtpClient();
            
            try
            {
                await client.ConnectAsync("smtp.gmail.com", 587);
                await client.AuthenticateAsync(mail, pw);
                await client.SendAsync(message);
            }
            catch (Exception ex)
            {
                // Log or handle the exception as needed
                Console.WriteLine($"Email sending failed: {ex.Message}");
            }
            finally
            {
                await client.DisconnectAsync(true);
                client.Dispose();
            }
        }
    }
}

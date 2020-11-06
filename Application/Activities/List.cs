using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<List<ActivityDto>> { }
        public class Handler : IRequestHandler<Query, List<ActivityDto>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities = await _context.Activities
                    .Include(x => x.UserActivities)
                    .ThenInclude(x => x.AppUser)
                    .ToListAsync();

                return activities.Select( a => ActivityToActivityDto(a))
                                 .ToList();
            }

            private ActivityDto ActivityToActivityDto(Activity activity) 
            {
                var attendees = activity.UserActivities.Select( a => UserActivityToAttendeeDto(a)).ToList();

                var activityDto = new ActivityDto
                {
                    Id = activity.Id,
                    Title = activity.Title,
                    Description = activity.Description,
                    Category = activity.Category,
                    Date = activity.Date,
                    City = activity.City,
                    Venue = activity.Venue,
                    Attendees = attendees
                };

                return activityDto;
            }

            private AttendeeDto UserActivityToAttendeeDto(UserActivity userActivity) 
            {
                return new AttendeeDto
                {
                    Username = userActivity.AppUser.UserName,
                    DisplayName = userActivity.AppUser.DisplayName,
                    Image = null,
                    IsHost = userActivity.IsHost
                };
            }
        }
    }
}
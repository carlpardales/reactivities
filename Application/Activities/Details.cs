using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<ActivityDto>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, ActivityDto>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<ActivityDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities
                    .Include(x => x.UserActivities)
                    .ThenInclude(x => x.AppUser)
                    .SingleOrDefaultAsync(x => x.Id == request.Id);

                if (activity == null)
                    throw new RestException(HttpStatusCode.NotFound, new {
                        activity = "Not Found"});

                
                var attendees = activity.UserActivities.Select( a => UserActivityToAttendeeDto(a)).ToList();
                return new ActivityDto
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
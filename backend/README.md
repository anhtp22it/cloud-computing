
```
server
├─ .mvn
│  └─ wrapper
│     └─ maven-wrapper.properties
├─ README.md
├─ mvnw
├─ mvnw.cmd
├─ pom.xml
├─ src
│  ├─ main
│  │  ├─ java
│  │  │  └─ API_BoPhieu
│  │  │     ├─ ApiBoPhieuApplication.java
│  │  │     ├─ ServletInitializer.java
│  │  │     ├─ config
│  │  │     │  └─ SwaggerConfig.java
│  │  │     ├─ constants
│  │  │     │  ├─ EventManagement.java
│  │  │     │  ├─ EventStatus.java
│  │  │     │  ├─ PollStatus.java
│  │  │     │  ├─ PollType.java
│  │  │     │  ├─ SeatStatus.java
│  │  │     │  └─ SeatType.java
│  │  │     ├─ controller
│  │  │     │  ├─ AttendantController.java
│  │  │     │  ├─ AuthController.java
│  │  │     │  ├─ EventController.java
│  │  │     │  ├─ EventManagerController.java
│  │  │     │  ├─ PollController.java
│  │  │     │  └─ UserController.java
│  │  │     ├─ dto
│  │  │     │  ├─ attendant
│  │  │     │  │  ├─ AttendantDto.java
│  │  │     │  │  ├─ AttendantResponse.java
│  │  │     │  │  ├─ ParticipantDto.java
│  │  │     │  │  ├─ ParticipantResponse.java
│  │  │     │  │  └─ ParticipantsDto.java
│  │  │     │  ├─ auth
│  │  │     │  │  ├─ ChangePasswordDto.java
│  │  │     │  │  ├─ LoginDto.java
│  │  │     │  │  ├─ LoginResponse.java
│  │  │     │  │  ├─ RegisterDto.java
│  │  │     │  │  └─ TokenRefreshDTO.java
│  │  │     │  ├─ common
│  │  │     │  │  └─ PageResponse.java
│  │  │     │  ├─ event
│  │  │     │  │  ├─ EventDetailResponse.java
│  │  │     │  │  ├─ EventDto.java
│  │  │     │  │  ├─ EventResponse.java
│  │  │     │  │  ├─ EventSearchRequest.java
│  │  │     │  │  ├─ ManagerInfo.java
│  │  │     │  │  ├─ ParticipantInfo.java
│  │  │     │  │  └─ SecretaryInfo.java
│  │  │     │  ├─ event_managers
│  │  │     │  │  ├─ EventManagerDto.java
│  │  │     │  │  └─ EventManagerResponse.java
│  │  │     │  ├─ poll
│  │  │     │  │  ├─ OptionDTO.java
│  │  │     │  │  ├─ OptionResponse.java
│  │  │     │  │  ├─ OptionStatsResponse.java
│  │  │     │  │  ├─ PollDTO.java
│  │  │     │  │  ├─ PollResponse.java
│  │  │     │  │  ├─ PollStatsResponse.java
│  │  │     │  │  └─ VoteDTO.java
│  │  │     │  └─ user
│  │  │     │     ├─ UserDto.java
│  │  │     │     └─ UserResponse.java
│  │  │     ├─ entity
│  │  │     │  ├─ Attendant.java
│  │  │     │  ├─ Event.java
│  │  │     │  ├─ EventManager.java
│  │  │     │  ├─ Option.java
│  │  │     │  ├─ Poll.java
│  │  │     │  ├─ RefreshToken.java
│  │  │     │  ├─ Role.java
│  │  │     │  ├─ Room.java
│  │  │     │  ├─ Seat.java
│  │  │     │  ├─ SeatAssignment.java
│  │  │     │  ├─ SpecialArea.java
│  │  │     │  ├─ User.java
│  │  │     │  └─ Vote.java
│  │  │     ├─ exception
│  │  │     │  ├─ AuthException.java
│  │  │     │  ├─ ErrorResponse.java
│  │  │     │  ├─ EventException.java
│  │  │     │  ├─ FileException.java
│  │  │     │  ├─ GlobalExceptionHandler.java
│  │  │     │  └─ PollException.java
│  │  │     ├─ mapper
│  │  │     │  ├─ EventMapper.java
│  │  │     │  ├─ OptionMapper.java
│  │  │     │  ├─ PollMapper.java
│  │  │     │  └─ UserMapper.java
│  │  │     ├─ repository
│  │  │     │  ├─ AttendantRepository.java
│  │  │     │  ├─ EventManagerRepository.java
│  │  │     │  ├─ EventRepository.java
│  │  │     │  ├─ OptionRepository.java
│  │  │     │  ├─ PollRepository.java
│  │  │     │  ├─ RefreshTokenRepository.java
│  │  │     │  ├─ RoleRepository.java
│  │  │     │  ├─ UserRepository.java
│  │  │     │  └─ VoteRepository.java
│  │  │     ├─ security
│  │  │     │  ├─ CustomUserDetailsService.java
│  │  │     │  ├─ JwtAuthenticationEntryPoint.java
│  │  │     │  ├─ JwtAuthenticationFilter.java
│  │  │     │  ├─ JwtTokenProvider.java
│  │  │     │  └─ SpringSecurityConfig.java
│  │  │     ├─ seed
│  │  │     │  └─ RoleSeeding.java
│  │  │     ├─ service
│  │  │     │  ├─ FileStorageService.java
│  │  │     │  ├─ FileStorageServiceImpl.java
│  │  │     │  ├─ QRCodeService.java
│  │  │     │  ├─ QRCodeServiceImpl.java
│  │  │     │  ├─ attendant
│  │  │     │  │  ├─ AttendantService.java
│  │  │     │  │  └─ AttendantServiceImpl.java
│  │  │     │  ├─ auth
│  │  │     │  │  ├─ AuthService.java
│  │  │     │  │  └─ AuthServiceImpl.java
│  │  │     │  ├─ event
│  │  │     │  │  ├─ EventService.java
│  │  │     │  │  └─ EventServiceImpl.java
│  │  │     │  ├─ event_manager
│  │  │     │  │  ├─ EventManagerService.java
│  │  │     │  │  └─ EventManagerServiceImpl.java
│  │  │     │  ├─ poll
│  │  │     │  │  ├─ PollService.java
│  │  │     │  │  └─ PollServiceImpl.java
│  │  │     │  └─ user
│  │  │     │     ├─ UserService.java
│  │  │     │     └─ UserServiceImpl.java
│  │  │     └─ specification
│  │  │        └─ EventSpecification.java
│  │  └─ resources
│  │     └─ application.properties
│  └─ test
│     └─ java
│        └─ API_BoPhieu
│           └─ ApiBoPhieuApplicationTests.java
├─ tree.txt
└─ uploads
   └─ banners
      ├─ banner_event_1_1751338813866.png
      └─ banner_event_3_1751338843309.png

```
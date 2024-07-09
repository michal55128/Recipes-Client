  //  @Autowired
  //  private final UserService userService;
  //  @Autowired
  //  private final JwtUtills jwtUtils;
  //  @Autowired
  //  private final  AuthenticationManager authenticationManager;


  //  @GetMapping("/")
  //  public String get() {
  //      return "hello";
  //  }

  //  @GetMapping()
  //  public List<UserEntity> getAllUsers() {
  //      return userService.getAllUsers();
  //  }

  //  @GetMapping("/{role}")
  //  public List<UserEntity> getUsersByRole(@PathVariable String role) {
  //      return userService.getUsersByRole(role);
  //  }

  //  @PostMapping("/{role}")
  //  public UserEntity addUser(@PathVariable String role, @RequestBody UserEntity user) {
  //      System.out.println("add user with role & email: " + role + user.getEmail());
  //      return userService.addUser(user.getEmail(), role);
  //  }

  //  @DeleteMapping("/{email}")
  //  public void removeUserPermission( @PathVariable String email) {
  //      System.out.println("change user permission with email:" + email );
  //      userService.removeUser(email);
  //  }


  //  @PostMapping("/login")
  //  public ResponseEntity<String> login(@RequestBody UserLoginDTO userLoginDTO) {
  //      System.out.println("Login attempt for user: " + userLoginDTO.getEmail());
  //       UserDetails userOpt = userService.loadUserByUsername(userLoginDTO.getEmail());

  //      if (userOpt != null) {
  //          if (userService.validatePassword(userLoginDTO.getPassword(), userOpt.getPassword())) {

  //              try {
  //                  authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userLoginDTO.getEmail(), userLoginDTO.getPassword()));
  //                  final UserDetails userDetails = userService.loadUserByUsername(userLoginDTO.getEmail());
  //                  String token = jwtUtils.generateToken(userDetails);

  //                  return ResponseEntity.ok(token);
  //              } catch (Exception e) {
  //                  return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
  //              }
  //          }
  //          else {
  //              return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
  //          }
  //      } else {
  //          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
  //      }

  //  }



  //  @PostMapping("/register")
  //  public ResponseEntity<String> register(@RequestBody UserEntity user) {
  //      userService.saveUser(user);
  //      return ResponseEntity.ok("User registered successfully!");
  //  }
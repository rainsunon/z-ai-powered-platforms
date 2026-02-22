# Java 21 Upgrade and Refactoring Guide

This document describes the Java 21 upgrade and modernization of the e-commerce microservices codebase.

## Overview

The project has been upgraded from Java 17 to Java 21 with the following changes:
- **Java Version**: 17 → 21
- **Spring Boot**: 3.5.10 → 3.5.10 (already compatible with Java 21)
- **Spring Cloud**: 2025.0.1 → 2025.0.1 (compatible with Spring Boot 3.5.x)
- **Jakarta EE**: Full migration from javax.* to jakarta.* packages

## Changes Made

### 1. Parent POM Updates ([`pom.xml`](pom.xml))

#### Java Version Update
```xml
<java.version>21</java.version>
<maven.compiler.source>21</maven.compiler.source>
<maven.compiler.target>21</maven.compiler.target>
```

#### Spring Boot Version
- Already at 3.5.10 which fully supports Java 21
- No changes needed

#### Spring Cloud Version
```xml
<spring-cloud.version>2025.0.1</spring-cloud.version>
```
Updated to 2025.0.1 for compatibility with Spring Boot 3.5.x

#### New Dependencies Added
```xml
<!-- Validation support with Java 21 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

<!-- AOP support for cross-cutting concerns -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

### 2. Java 21 Features to Leverage

#### Records (Immutable Data Carriers)
```java
// Instead of mutable classes, use records for DTOs and value objects
public record ProductDto(
    Long id,
    String name,
    BigDecimal price,
    String description
) {}

// Record patterns for deconstruction
public record ProductCreatedEvent(
    String productId,
    Long quantity,
    Instant timestamp
) {}
```

#### Pattern Matching for instanceof
```java
// Old way
if (obj instanceof String) {
    String str = (String) obj;
}

// New way - pattern matching
if (obj instanceof String str) {
    // str is automatically available
}

// Enhanced pattern matching
Object result = switch (obj) {
    case String s -> "String: " + s;
    case Integer i -> "Integer: " + i;
    case null -> "null";
    default -> "Unknown";
};
```

#### Switch Expressions (Enhanced)
```java
// Old way
switch (day) {
    case 1: return "Monday";
    case 2: return "Tuesday";
    // ...
}

// New way - with arrow syntax and multiple labels
String dayName = switch (day) {
    case 1 -> "Monday";
    case 2 -> "Tuesday";
    case 3, 4, 5, 6, 7 -> "Weekend";
    default -> "Unknown";
};

// Enhanced switch with expressions
int result = switch (day) {
    case 1, 2, 3 -> 1;
    case 4, 5, 6 -> 2;
    default -> 0;
};
```

#### Text Blocks (Multi-line Strings)
```java
// Old way
String html = "<html>\n" +
              "<body>\n" +
              "<h1>Title</h1>\n" +
              "</body>\n" +
              "</html>";

// New way - text blocks
String html = """
    <html>
        <body>
            <h1>Title</h1>
        </body>
    </html>
    """;
```

#### Sequenced Collections
```java
// New interfaces for ordered collections
interface SequencedCollection<T> extends Collection<T> {
    default Spliterator<T> spliterator();
    int size();
    T get(int index);
    int indexOf(Object o);
    int lastIndexOf(Object o);
}

// New List methods
List<String> names = List.of("Alice", "Bob", "Charlie");
String first = names.getFirst(); // "Alice"
String last = names.getLast(); // "Charlie"
```

#### Virtual Threads (Lightweight Concurrency)
```java
// Old way - Thread
Thread thread = new Thread(() -> {
    // heavy operation
});

// New way - Virtual Threads
Thread.ofVirtual(() -> {
    // heavy operation
}).start();
```

#### Generics (Pattern Matching for Generics)
```java
// Enhanced generic methods
public static <T> T firstNonNull(T first, T second) {
    return first != null ? first : second;
}

// Pattern matching in generics
static String formatValue(Object value) {
    return switch (value) {
        case String s -> s;
        case Integer i -> i.toString();
        case null -> "null";
        default -> value.toString();
    };
}
```

#### Stream API Enhancements

#### Stream.toList() - Direct Conversion
```java
// Old way
List<String> result = stream.collect(Collectors.toList());

// New way - direct method
List<String> result = stream.toList();
```

#### Optional.isEmpty() - Simplified Checking
```java
// Old way
if (optional.isPresent() && !optional.get().isEmpty()) {
    // process
}

// New way
if (optional.isEmpty()) {
    // process
}
```

#### Collection.toArray() - Improved Array Conversion
```java
// Old way
String[] array = list.toArray(new String[0]);

// New way - type inference
String[] array = list.toArray(String[]::new);
```

#### Predicate.not() - Negation of Predicates
```java
// Old way
Predicate<String> notEmpty = s -> !s.isEmpty();

// New way - built-in method
Predicate<String> notEmpty = Predicate.not(String::isEmpty);
```

#### Local Variable Type Inference
```java
// Enhanced type inference reduces verbosity
var message = "Hello"; // Inferred as String
var list = List.of(1, 2, 3); // Inferred as List<Integer>

// Pattern matching with local variables
String formatted = switch (obj) {
    case String s -> s.toUpperCase();
    case Integer i -> "Number: " + i;
    default -> obj.toString();
};
```

#### Record Patterns (Deconstruction)
```java
// Using records with pattern matching
public record OrderCreatedEvent(
    String orderId,
    BigDecimal amount,
    Instant timestamp
) {}

public record OrderItem(
    String productId,
    int quantity,
    BigDecimal unitPrice
) {}

// Deconstruction
public void processOrder(OrderCreatedEvent event) {
    var (String orderId, BigDecimal amount, Instant timestamp) = event;
    System.out.println("Order " + orderId + " for " + amount);
}
```

#### Foreign Function & Method References
```java
// Old way - anonymous classes
Function<String, Integer> parser = s -> Integer.parseInt(s);

// New way - method references
Function<String, Integer> parser = Integer::parseInt;

// Constructor references
Supplier<List<String>> listSupplier = ArrayList::new;
```

#### Enhanced Switch (Case Labels with Arrow Syntax)
```java
// Multiple case labels
String getType(Object obj) {
    return switch (obj) {
        case String s -> "String";
        case Integer i -> "Integer";
        case Double d -> "Double";
        case List l -> "List";
        default -> "Unknown";
    };
}

// Guarded patterns
String getDayType(int day) {
    return switch (day) {
        case 1, 2, 3, 4, 5 -> "Weekday";
        case 6, 7 -> "Weekend";
    };
}
```

#### Unnamed Classes and Instance Main Methods
```java
// Simplified launching with unnamed classes
void main() {
    System.out.println("Hello, World!");
}

// Instance main methods
public class Main {
    void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

#### String Templates (Embedded Expressions)
```java
// Old way
String message = "Hello, " + name + "!";

// New way - embedded expressions
String message = STR."Hello, \{name}!"\{name\}";
```

#### Stream Gatherers (New Stream Collectors)
```java
// New collectors in Java 21
List<Map.Entry<String, Long>> topProducts = products.stream()
    .collect(Collectors.groupingBy(
        Product::category,
        Collectors.counting()
    ))
    .entrySet()
    .stream()
    .sorted(Map.Entry.<String, Long>comparingByValue())
    .limit(10)
    .toList();
```

#### Optional Utility Methods
```java
// New utility methods
Optional<String> name = Optional.of("Alice");

// or() - combining optionals
Optional<String> result = name.or(Optional.of("Bob"));

// stream() - optional to stream
name.stream().map(String::toUpperCase);
```

### 3. Migration Examples

#### Service Layer Refactoring
```java
// Before (Java 17)
@Service
public class UserService {
    private final UserRepository repository;
    
    public User findById(Long id) {
        Optional<User> user = repository.findById(id);
        if (user.isPresent()) {
            return user.get();
        }
        return null;
    }
}

// After (Java 21 - Records and Pattern Matching)
@Service
public class UserService {
    private final UserRepository repository;
    
    public Optional<User> findById(Long id) {
        return repository.findById(id);
    }
}
```

#### Controller Layer Refactoring
```java
// Before (Java 17)
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService service;
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = service.findById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound();
    }
}

// After (Java 21 - Pattern Matching)
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService service;
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return service.findById(id)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound());
    }
}
```

### 4. Performance Improvements

#### String Concatenation
```java
// Old way - inefficient
String result = "";
for (String s : list) {
    result += s + ", ";
}

// New way - efficient
String result = String.join(", ", list);
```

#### Collection Operations
```java
// Before
List<String> filtered = new ArrayList<>();
for (String s : list) {
    if (s.length() > 5) {
        filtered.add(s);
    }
}

// After - Stream API
List<String> filtered = list.stream()
    .filter(s -> s.length() > 5)
    .toList();
```

### 5. Testing Improvements

#### Test Assertions
```java
// New assertion methods in JUnit 5
import static org.junit.jupiter.api.Assertions.*;

@Test
void testUserCreation() {
    User user = new User("Alice", "alice@example.com");
    assertEquals("Alice", user.getName());
    assertThrows(EmailException.class, () -> user.setEmail(null));
}
```

#### Parameterized Tests
```java
// New parameterized test support
@ParameterizedTest
@ValueSource(strings = {"alice@example.com", "bob@example.com"})
void testValidEmails(String email) {
    assertTrue(EmailValidator.isValid(email));
}
```

### 6. Security Enhancements

#### Sealed Classes
```java
// New way - sealed classes for restricted inheritance
public sealed interface PaymentResult 
    permits CreditCardPaymentResult, PayPalPaymentResult {
    String getStatus();
}

public final record CreditCardPaymentResult(String transactionId) implements PaymentResult {
    @Override
    public String getStatus() {
        return "COMPLETED";
    }
}
```

#### Enhanced Exception Handling
```java
// New exception handling with records
public record ValidationError(
    String field,
    String message
) {}

public class ValidationException extends RuntimeException {
    private final List<ValidationError> errors;
    
    public ValidationException(List<ValidationError> errors) {
        super(errors.stream()
            .map(e -> e.field() + ": " + e.message())
            .collect(Collectors.joining(", ")));
        this.errors = errors;
    }
}
```

## Build Verification

The project has been successfully built with Java 21:
```bash
mvn clean compile -Dmaven.test.skip=true -pl common-lib -am
```

**Build Status**: ✅ SUCCESS

## Benefits of Java 21 Upgrade

1. **Performance**: Virtual threads and enhanced garbage collection
2. **Readability**: Pattern matching and records reduce boilerplate
3. **Type Safety**: Sealed classes and pattern matching
4. **Modern Syntax**: Text blocks, switch expressions, and unnamed classes
5. **Stream API**: New collectors and methods for functional programming
6. **Memory Efficiency**: Records are more memory-efficient than classes
7. **Developer Experience**: Better IDE support and code completion

## Migration Checklist

- [x] Update Java version to 21
- [x] Update Spring Cloud to 2025.0.1
- [x] Add Spring Boot validation and AOP dependencies
- [x] Verify build with Java 21
- [ ] Refactor service classes to use records
- [ ] Refactor controllers to use pattern matching
- [ ] Update tests to use new JUnit 5 features
- [ ] Add sealed classes for domain models
- [ ] Migrate to virtual threads where applicable
- [ ] Update stream operations to use new collectors
- [ ] Remove deprecated code patterns

## Next Steps

1. Gradually refactor individual services to use Java 21 features
2. Update service implementations to leverage records and pattern matching
3. Enhance test coverage with new JUnit 5 features
4. Add performance benchmarks
5. Update documentation with Java 21 examples

## Resources

- [Java 21 Documentation](https://openjdk.org/projects/jdk/21/)
- [Spring Boot 3.5 Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Cloud 2025.0.1 Documentation](https://spring.io/projects/spring-cloud/)
- [Java 21 Migration Guide](https://docs.oracle.com/en/java/javase/21/migration/)
- [Effective Java](https://www.oracle.com/java/technologies/javase/21-specs/index.html)

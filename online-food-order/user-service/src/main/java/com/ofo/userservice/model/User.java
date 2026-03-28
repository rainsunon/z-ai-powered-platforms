package com.ofo.userservice.model;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Pattern.Flag;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table(name = "users")
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({"id","firstName","lastName","speciality","dob","mobile","emailId","createdDate"})
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(updatable = false, nullable = false,name="id")
	private Long id;

	@NotEmpty
	@Size(min = 1, max = 20)
	@Column(name="first_name")
	private String firstName;

	@NotEmpty
	@Size(min = 1, max = 20)
	@Column(name="last_name")
	private String lastName;

	@Column(name="dob")
	@NotNull(message = "dob is required")
	@Temporal(TemporalType.DATE)
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern="yyyy-MM-dd")
	private Date dob;

	@NotBlank
	@Pattern(regexp = "^\\d{10,10}$")
	@Column(unique = true, length = 10, name="mobile")
	private String mobile;

	@NotEmpty
	@Email(flags = { Flag.CASE_INSENSITIVE })
	@Column(name="email_id")
	private String emailId;

	@Column
	@NotEmpty
	@Temporal(TemporalType.DATE)
	private Date createdDate;
}
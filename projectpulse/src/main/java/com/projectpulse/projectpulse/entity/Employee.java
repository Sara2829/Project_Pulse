package com.projectpulse.projectpulse.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "employee")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne() // Assuming projectid refers to a Project entity
    @JoinColumn(name = "project_id") // The column name in the database, should match the database schema
    private Project project; // Assuming the project is an entity, not just a string

    @Column(name = "date", nullable = true)
    private LocalDate date; // Ensure the column type in MySQL is DATE

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    // Constructor with all fields
    public Employee(Long id, String name, Project project, LocalDate date) {
        this.id = id;
        this.name = name;
        this.project = project;
        this.date = date;
    }

    // Default constructor
    public Employee() {

    }
}

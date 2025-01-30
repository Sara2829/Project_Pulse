package com.projectpulse.projectpulse.entity;

import com.projectpulse.projectpulse.Enum.Status;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "bug_report")
public class BugReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne() // Assuming 'user' is a reference to the User entity
    @JoinColumn(name = "user_id")
    private User user;

    @Column
    private String description;

    @Column
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column
    private Long jiraid;

    @Column(name = "date")
    private LocalDate date;



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Long getJiraid() {
        return jiraid;
    }

    public void setJiraid(Long jiraid) {
        this.jiraid = jiraid;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }


    public BugReport(Long id, User user, String description, Status status, Long jiraid, LocalDate date) {
        this.id = id;
        this.user = user;
        this.description = description;
        this.status = status;
        this.jiraid = jiraid;
        this.date = date;
    }


    public BugReport() {

    }
}

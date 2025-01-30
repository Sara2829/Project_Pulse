package com.projectpulse.projectpulse.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "chat_history")
public class ChatHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne()
    @JoinColumn(name = "user_id")
    private User user;

    @Column
    private String query;

    @Column
    private String botresponse;

    @Column(name = "date")
    private LocalDate date;

    // Default constructor
    public ChatHistory() {}

    // Constructor with all fields
    public ChatHistory(Long id, User user, String query, String botresponse, LocalDate date) {
        this.id = id;
        this.user = user;
        this.query = query;
        this.botresponse = botresponse;
        this.date = date;
    }

    // Getter and setter for id
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // Getter and setter for user (mapped as ManyToOne relationship)
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // Getter and setter for query
    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    // Getter and setter for botresponse
    public String getBotresponse() {
        return botresponse;
    }

    public void setBotresponse(String botresponse) {
        this.botresponse = botresponse;
    }

    // Getter and setter for date
    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}

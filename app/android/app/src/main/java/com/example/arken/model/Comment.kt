package com.example.arken.model

import java.io.Serializable
import java.util.*
import javax.net.ssl.X509ExtendedTrustManager

class Comment(
    val userId: String?,
    val _id: String?,
    val related: String?,
    val text: String?,
    val date: Date?,
    val about: String?,
    val username: String?,
    val usersurname: String?
) : Serializable{
    constructor(related: String, text: String, about: String) : this(null, null, related, text, null, about, null, null)
    constructor(username: String?, usersurname: String?, text: String, id: String) : this(id, null, null, text, null, null, username, usersurname)

}
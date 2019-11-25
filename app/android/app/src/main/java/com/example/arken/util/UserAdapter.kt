package com.example.arken.util

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.model.User

class UserAdapter(var dataSet: MutableList<User>, val userClickedListener: OnUserClickedListener) :
    RecyclerView.Adapter<UserAdapter.ViewHolder>() {

    class ViewHolder(v: View) : RecyclerView.ViewHolder(v) {
        private val userName: TextView = v.findViewById(R.id.user_name)
        private val userLocation: TextView = v.findViewById(R.id.user_country)

        fun bind(user: User, userClickedListener: OnUserClickedListener) {
            userName.text = user.name + " " + user.surname
            userLocation.text = user.location

            itemView.setOnClickListener {
                userClickedListener.onItemClicked(user._id!!)
            }
        }
    }

    // Create new views (invoked by the layout manager)
    override fun onCreateViewHolder(viewGroup: ViewGroup, viewType: Int): ViewHolder {
        // Create a new view.
        val v = LayoutInflater.from(viewGroup.context)
            .inflate(R.layout.user_row, viewGroup, false)

        return ViewHolder(v)
    }

    override fun onBindViewHolder(viewHolder: ViewHolder, position: Int) {

        // Get element from your dataset at this position and replace the contents of the view
        // with that element
        val user = dataSet[position]
        viewHolder.bind(user, userClickedListener)
    }

    // Return the size of your dataset (invoked by the layout manager)
    override fun getItemCount() = dataSet.size
}

interface OnUserClickedListener {
    fun onItemClicked(userId: String)
}
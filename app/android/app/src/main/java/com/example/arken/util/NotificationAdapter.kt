package com.example.arken.util

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.model.Notification
import com.example.arken.model.ListNotification

class NotificationAdapter(
    var dataSet: MutableList<Notification>
) :
    RecyclerView.Adapter<NotificationAdapter.ViewHolder>() {

    class ViewHolder(v: View) : RecyclerView.ViewHolder(v) {

        private val notificationText: TextView = v.findViewById(R.id.notification_text)
        private val notificationImage: ImageView = v.findViewById(R.id.notification_image)

        fun bind(
            notification: Notification,
            position: Int
        ) {

            notificationText.text = notification.text

            when {
                notification.text!!.contains("true", ignoreCase = true) -> {
                    notificationImage.setImageResource(R.drawable.ic_green_check)
                }
                notification.text!!.contains("false", ignoreCase = true) -> {
                    notificationImage.setImageResource(R.drawable.ic_red_cross)
                }
                notification.text!!.contains("follow", ignoreCase = true) -> {
                    notificationImage.setImageResource(R.drawable.ic_person_white)
                }
                notification.text!!.contains("more", ignoreCase = true) -> {
                    notificationImage.setImageResource(R.drawable.ic_trending_up)
                }
                notification.text!!.contains("less", ignoreCase = true) -> {
                    notificationImage.setImageResource(R.drawable.ic_trending_down)
                }
            }

        }
    }

    // Create new views (invoked by the layout manager)
    override fun onCreateViewHolder(viewGroup: ViewGroup, viewType: Int): ViewHolder {
        // Create a new view.
        val v = LayoutInflater.from(viewGroup.context)
            .inflate(R.layout.fragment_notification, viewGroup, false)

        return ViewHolder(v)
    }

    override fun onBindViewHolder(viewHolder: ViewHolder, position: Int) {

        // Get element from your dataset at this position and replace the contents of the view
        // with that element
        val notification = dataSet[position]
        viewHolder.bind(notification, position)
    }

    // Return the size of your dataset (invoked by the layout manager)
    override fun getItemCount() = dataSet.size
}


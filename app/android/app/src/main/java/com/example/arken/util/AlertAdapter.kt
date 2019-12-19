package com.example.arken.util

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.model.Alert
import com.example.arken.model.FollowRequest

class AlertAdapter(
    var dataSet: MutableList<Alert>,
    val alarmClickedListener: OnAlarmClickedListener
) :
    RecyclerView.Adapter<AlertAdapter.ViewHolder>() {

    class ViewHolder(v: View) : RecyclerView.ViewHolder(v) {
        private val userName: TextView = v.findViewById(R.id.user_name)
        private val reject: ImageView = v.findViewById(R.id.user_pending_reject)

        fun bind(
            alert: Alert,
            alarmClickedListener: OnAlarmClickedListener,
            position: Int
        ) {


            userName.text = "Alert when " + alert.currency + " is "+ alert.compare +" than "+ alert.rate
            reject.visibility = View.VISIBLE

            reject.setOnClickListener {
                alarmClickedListener.onRejectClicked(alert._id!!, position)
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
        viewHolder.bind(user, alarmClickedListener, position)
    }

    // Return the size of your dataset (invoked by the layout manager)
    override fun getItemCount() = dataSet.size
}

interface OnAlarmClickedListener {
    fun onRejectClicked(followingId: String, position: Int)
}
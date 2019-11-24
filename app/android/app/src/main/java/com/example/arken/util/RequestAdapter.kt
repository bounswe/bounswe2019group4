package com.example.arken.util

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.model.FollowRequest

class RequestAdapter(var dataSet: MutableList<FollowRequest>, val requestClickedListener: OnRequestClickedListener, val mode:Int) :
    RecyclerView.Adapter<RequestAdapter.ViewHolder>() {

    class ViewHolder(v: View) : RecyclerView.ViewHolder(v) {
        private val userName: TextView = v.findViewById(R.id.user_name)
        private val accept: ImageView = v.findViewById(R.id.user_pending_accept)
        private val reject: ImageView = v.findViewById(R.id.user_pending_reject)
        private val userLocation: TextView = v.findViewById(R.id.user_country)

        fun bind(req: FollowRequest, requestClickedListener: OnRequestClickedListener, position: Int, mode:Int) {
            userName.text = req.FollowingName + " "+ req.FollowingSurname
            if(mode == 0){
                accept.visibility = View.VISIBLE
                reject.visibility = View.VISIBLE
            }
            else{
                accept.visibility = View.GONE
                reject.visibility = View.GONE
            }
            userLocation.visibility = View.GONE

            accept.setOnClickListener{
                requestClickedListener.onAcceptClicked(req._id!!, position)
            }

            reject.setOnClickListener{
                requestClickedListener.onRejectClicked(req._id!!, position)
            }

            itemView.setOnClickListener {
                requestClickedListener.onItemClicked(req._id!!, position)
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
        viewHolder.bind(user, requestClickedListener, position, mode)
    }

    fun removeAt(position: Int){
        val req = dataSet[position]
        dataSet.remove(req)
    }

    // Return the size of your dataset (invoked by the layout manager)
    override fun getItemCount() = dataSet.size
}

interface OnRequestClickedListener {
    fun onItemClicked(userId: String, position: Int)
    fun onAcceptClicked(followingId: String, position: Int)
    fun onRejectClicked(followingId:String, position: Int)
}
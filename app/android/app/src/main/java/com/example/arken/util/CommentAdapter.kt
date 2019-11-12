package com.example.arken.util

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.model.Comment

class CommentAdapter(var dataSet: MutableList<Comment>, val itemClickListener: OnCommentClickListener) :
    RecyclerView.Adapter<CommentAdapter.ViewHolder>() {

    class ViewHolder(v: View) : RecyclerView.ViewHolder(v) {
        private val userName: TextView = v.findViewById(R.id.list_comment_user_name)
        private val commentBody: TextView = v.findViewById(R.id.list_comment_body)
        private val commentDate:TextView = v.findViewById(R.id.list_comment_date)

        fun bind(comment: Comment, clickListener: OnCommentClickListener) {
            userName.text = comment.userId
            commentBody.text = comment.text
            commentDate.text = comment.date.toString()

            itemView.setOnClickListener {
                clickListener.onItemClicked(comment)
            }
        }
    }

    // Create new views (invoked by the layout manager)
    override fun onCreateViewHolder(viewGroup: ViewGroup, viewType: Int): ViewHolder {
        // Create a new view.
        val v = LayoutInflater.from(viewGroup.context)
            .inflate(R.layout.comment_row, viewGroup, false)

        return ViewHolder(v)
    }

    override fun onBindViewHolder(viewHolder: ViewHolder, position: Int) {

        // Get element from your dataset at this position and replace the contents of the view
        // with that element
        val comment = dataSet[position]
        viewHolder.bind(comment, itemClickListener)
    }

    // Return the size of your dataset (invoked by the layout manager)
    override fun getItemCount() = dataSet.size
}

interface OnCommentClickListener {
    fun onItemClicked(comment: Comment)
}
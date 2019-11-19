package com.example.arken.util

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.model.Comment

class CommentAdapter(var dataSet: MutableList<Comment>, val userId:String, val deletedListener: OnCommentDeletedListener) :
    RecyclerView.Adapter<CommentAdapter.ViewHolder>() {

    class ViewHolder(v: View) : RecyclerView.ViewHolder(v) {
        private val userName: TextView = v.findViewById(R.id.list_comment_user_name)
        private val commentBody: TextView = v.findViewById(R.id.list_comment_body)
        private val commentDate:TextView = v.findViewById(R.id.list_comment_date)
        private val deleteButton: ImageView = v.findViewById(R.id.comment_delete)

        fun bind(comment: Comment, userId: String, deletedListener: OnCommentDeletedListener, position: Int) {
            userName.text = comment.username + " "+ comment.usersurname
            commentBody.text = comment.text
            commentDate.text = comment.date.toString()
            if(userId == comment.userId){
                deleteButton.visibility = View.VISIBLE
            }
            else{
                deleteButton.visibility = View.GONE
            }

            deleteButton.setOnClickListener{
                deletedListener.onItemClicked(comment._id!!, position)
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
        viewHolder.bind(comment, userId, deletedListener, position)
    }

    // Return the size of your dataset (invoked by the layout manager)
    override fun getItemCount() = dataSet.size
}

interface OnCommentDeletedListener {
    fun onItemClicked(commentId: String, position:Int)
}
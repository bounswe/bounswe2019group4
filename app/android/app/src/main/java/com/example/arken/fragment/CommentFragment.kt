package com.example.arken.fragment

import android.annotation.SuppressLint
import android.app.Activity
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.fragment.app.Fragment
import com.example.arken.R
import com.example.arken.model.Comment
import com.example.arken.util.OnCommentClickListener
import java.util.*

class CommentFragment : Fragment() {
    private var onCommentSubmittedListener: OnCommentSubmitted? = null
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_comment, container, false)

        return view
    }
    override fun onAttach(activity: Activity) {
        super.onAttach(activity)

        // This makes sure that the container activity has implemented
        // the callback interface. If not, it throws an exception
        try {
            onCommentSubmittedListener = activity as OnCommentSubmitted
            ?
        } catch (e: ClassCastException) {
            throw ClassCastException("$activity must implement TextClicked")
        }
    }
//name alıyormuş gibi
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        //shared pref kullanabilirsin
        val userName: EditText = view.findViewById(R.id.comment_name_editText)
        val commentBody: EditText = view.findViewById(R.id.comment_body)
        val commentDate:TextView = view.findViewById(R.id.comment_date)
        userName.hint = "Elif"
        commentDate.text = "20.10.2019"
        val submitComment: Button = view.findViewById(R.id.comment_submit_button)
        submitComment.setOnClickListener {
            Log.i("send ", " button")
            onCommentSubmittedListener?.onSubmit(Comment(" id", "related", commentBody.text.toString(), Date(2019, 10, 9), "about" ), commentDate)
        }
    }
    interface OnCommentSubmitted{
        fun onSubmit(comment: Comment, textView: TextView)
    }
}

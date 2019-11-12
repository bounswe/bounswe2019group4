package com.example.arken.fragment

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.navArgs
import com.example.arken.R

class CommentFragment : Fragment() {
    val args: EventFragmentArgs by navArgs()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_comment, container, false)

        return view
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
        }
}
}

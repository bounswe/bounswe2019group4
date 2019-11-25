package com.example.arken.fragment

import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.example.arken.R
import com.example.arken.model.Profile
import com.example.arken.util.RetroClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

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

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        //shared pref kullanabilirsin
        val userNameText: EditText = view.findViewById(R.id.comment_name_editText)
        val commentBody: EditText = view.findViewById(R.id.comment_body)
        val submitComment: Button = view.findViewById(R.id.comment_submit_button)
        lateinit var profile: Profile

        val userCookie =
            activity!!.getSharedPreferences(LoginFragment.MY_PREFS_NAME, Context.MODE_PRIVATE)
                .getString("user_cookie", "")
        val call: Call<Profile> = RetroClient.getInstance().apiService.getProfile(
            userCookie, activity!!.getSharedPreferences(
                LoginFragment.MY_PREFS_NAME,
                Context.MODE_PRIVATE
            )
                .getString("userId", "defaultId")
        )

        call.enqueue(object : Callback<Profile> {
            override fun onResponse(call: Call<Profile>, response: Response<Profile>) {
                if (response.isSuccessful) {
                    profile = response.body()!!

                    userNameText.setText(profile.user?.name + " " + profile.user?.surname)

                } else {
                    Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Profile>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })

        submitComment.setOnClickListener {
            Log.i("send ", " button")
            onCommentSubmittedListener?.onSubmit(commentBody.text.toString())
            commentBody.setText("")
        }
    }

    interface OnCommentSubmitted {
        fun onSubmit(text: String)
    }

    companion object {
        fun newInstance(onCommentSubmitted: OnCommentSubmitted): CommentFragment {
            val frag = CommentFragment()
            frag.onCommentSubmittedListener = onCommentSubmitted
            return frag
        }
    }
}

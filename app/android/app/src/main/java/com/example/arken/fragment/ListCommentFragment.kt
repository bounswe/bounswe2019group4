package com.example.arken.fragment

import android.content.Context.MODE_PRIVATE
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.fragment.LoginFragment.MY_PREFS_NAME
import com.example.arken.model.Comment
import com.example.arken.model.Event
import com.example.arken.model.tradingEquipment.Currency
import com.example.arken.util.CommentAdapter
import com.example.arken.util.OnCommentDeletedListener
import com.example.arken.util.RetroClient
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

/*
    1)teye comment ekleme
    2) guest ise comment yazma yok
    3) dataset yenileme
 */

class ListCommentFragment : Fragment(), CommentFragment.OnCommentSubmitted,
    OnCommentDeletedListener {

    private lateinit var recyclerView: RecyclerView
    private var dataset: MutableList<Comment> = mutableListOf()
    private lateinit var commentAdapter: CommentAdapter
    private var related = ""
    private var about = ""

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val rootView = inflater.inflate(
            R.layout.fragment_comment_list,
            container, false
        ).apply { tag = TAG }

        recyclerView = rootView.findViewById(R.id.recyclerView)
        val userId = activity!!.getSharedPreferences(
            MY_PREFS_NAME, MODE_PRIVATE
        ).getString("userId", "defaultId")!!

        commentAdapter = CommentAdapter(dataset, userId, this)
        recyclerView.adapter = commentAdapter

        initDataset()
        recyclerView.adapter?.notifyDataSetChanged()

        Log.i("ListCommentFragment", "onCreateView")
        if (userId != "defaultId") {
            fragmentManager?.beginTransaction()
                ?.add(R.id.fragment_make_comment, CommentFragment.newInstance(this), "comment")
                ?.commit()
        }
        return rootView
    }

    override fun onSubmit(comment: String) {

        val userCookie = activity!!.getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE)
            .getString("user_cookie", "")
        val call = RetroClient.getInstance().apiService.makeComment(
            userCookie,
            Comment(related, comment, about)
        )
        call.enqueue(object : Callback<ResponseBody> {
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                if (response.isSuccessful) {
                    Toast.makeText(context, "Your comment is sent", Toast.LENGTH_SHORT).show()
                    initDataset()
                    recyclerView.adapter?.notifyDataSetChanged()
                } else {
                    Toast.makeText(context, response.message(), Toast.LENGTH_SHORT).show()

                }
            }

            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })

    }

    override fun onItemClicked(commentId: String, position: Int) {
        val userCookie = activity!!.getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE)
            .getString("user_cookie", "")
        if (about == "EVENT") {
            val call: Call<ResponseBody> =
                RetroClient.getInstance().apiService.deleteEventComment(userCookie, commentId)

            call.enqueue(object : Callback<ResponseBody> {
                override fun onResponse(
                    call: Call<ResponseBody>,
                    response: Response<ResponseBody>
                ) {
                    if (response.isSuccessful) {
                        Toast.makeText(context, "Your comment is deleted", Toast.LENGTH_SHORT)
                            .show()
                        dataset.removeAt(position)
                        commentAdapter.dataSet = dataset
                        commentAdapter.notifyDataSetChanged()

                    } else {
                        Toast.makeText(context, response.message(), Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                    Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
                }
            })
        } else if (about == "TRADING-EQUIPMENT") {
            val call: Call<ResponseBody> =
                RetroClient.getInstance().apiService.deleteTEComment(userCookie, commentId)

            call.enqueue(object : Callback<ResponseBody> {
                override fun onResponse(
                    call: Call<ResponseBody>,
                    response: Response<ResponseBody>
                ) {
                    if (response.isSuccessful) {
                        Toast.makeText(context, "Your comment is deleted", Toast.LENGTH_SHORT)
                            .show()
                        dataset.removeAt(position)
                        commentAdapter.dataSet = dataset
                        commentAdapter.notifyDataSetChanged()

                    } else {
                        Toast.makeText(context, response.message(), Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                    Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
                }
            })
        }
    }

    fun initDataset() {
        val userCookie = activity!!.getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE)
            .getString("user_cookie", "")
        if (about == "EVENT") {
            val call: Call<Event> = RetroClient.getInstance().apiService.getEvent(related)

            call.enqueue(object : Callback<Event> {
                override fun onResponse(call: Call<Event>, response: Response<Event>) {
                    if (response.isSuccessful) {
                        val callEvent: Event? = response.body()
                        if (callEvent != null) {
                            var comments = callEvent.comments
                            dataset = comments
                            commentAdapter.dataSet = dataset
                            commentAdapter.notifyDataSetChanged()
                        }
                    } else {
                        Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT)
                            .show()
                    }
                }

                override fun onFailure(call: Call<Event>, t: Throwable) {
                    Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
                }
            })
        } else if (about == "TRADING-EQUIPMENT") {
            val call: Call<Currency> =
                RetroClient.getInstance().apiService.getCurrency(userCookie, related)

            call.enqueue(object : Callback<Currency> {
                override fun onResponse(call: Call<Currency>, response: Response<Currency>) {
                    if (response.isSuccessful) {
                        val callCurrency: Currency? = response.body()
                        if (callCurrency != null) {
                            var comments = callCurrency.comments
                            dataset = comments
                            commentAdapter.dataSet = dataset
                            commentAdapter.notifyDataSetChanged()
                        }
                    } else {
                        Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT)
                            .show()
                    }
                }

                override fun onFailure(call: Call<Currency>, t: Throwable) {
                    Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
                }
            })
        }

    }

    companion object {
        private val TAG = "RecyclerViewFragment"
        private val KEY_LAYOUT_MANAGER = "layoutManager"
        fun newInstance(related: String, about: String): ListCommentFragment {
            val instance = ListCommentFragment()
            instance.related = related
            instance.about = about
            return instance
        }
    }

}




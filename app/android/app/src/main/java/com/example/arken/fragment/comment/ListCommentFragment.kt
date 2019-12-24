package com.example.arken.fragment.comment

import android.content.Context.MODE_PRIVATE
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.fragment.event.ListEventFragmentDirections
import com.example.arken.fragment.signup_login.LoginFragment.MY_PREFS_NAME
import com.example.arken.fragment.tEq.ListCurrentFragmentDirections
import com.example.arken.model.Article
import com.example.arken.model.Comment
import com.example.arken.model.Event
import com.example.arken.model.EventWithComment
import com.example.arken.model.tradingEquipment.Currency
import com.example.arken.util.CommentAdapter
import com.example.arken.util.OnCommentClickedListener
import com.example.arken.util.RetroClient
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ListCommentFragment : Fragment(), CommentFragment.OnCommentSubmitted,
    OnCommentClickedListener {

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
        }   else if (about == "ARTICLE") {
            val call: Call<ResponseBody> =
                RetroClient.getInstance().apiService.deleteArticleComment(userCookie, commentId)

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
            val call: Call<EventWithComment> = RetroClient.getInstance().apiService.getEvent(related)

            call.enqueue(object : Callback<EventWithComment> {
                override fun onResponse(call: Call<EventWithComment>, response: Response<EventWithComment>) {
                    if (response.isSuccessful) {
                        val callEvent: EventWithComment? = response.body()
                        if (callEvent != null) {
                            var comments = callEvent.comments
                            dataset = comments as MutableList<Comment>
                            commentAdapter.dataSet = dataset
                            commentAdapter.notifyDataSetChanged()
                        }
                    } else {
                        Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT)
                            .show()
                    }
                }

                override fun onFailure(call: Call<EventWithComment>, t: Throwable) {
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
        } else if (about == "ARTICLE") {
            val call: Call<Article> =
                RetroClient.getInstance().apiService.getArticle(userCookie, related)

            call.enqueue(object : Callback<Article> {
                override fun onResponse(call: Call<Article>, response: Response<Article>) {
                    if (response.isSuccessful) {
                        val article: Article? = response.body()
                        if (article != null) {
                            var comments = article.comments
                            if(comments!= null){
                                dataset = comments
                            }
                            else{
                                dataset = mutableListOf()
                            }
                            commentAdapter.dataSet = dataset
                            commentAdapter.notifyDataSetChanged()
                        }
                    } else {
                        Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT)
                            .show()
                    }
                }

                override fun onFailure(call: Call<Article>, t: Throwable) {
                    Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
                }
            })
        }

    }
    override fun onUserNameClicked(userId: String) {
        if(findNavController().currentDestination?.id == R.id.eventFragment){
            findNavController().popBackStack()
            val act = ListEventFragmentDirections.actionEventListFragmentToProfileFragment(userId)
            findNavController().navigate(act)
        }
        else if(findNavController().currentDestination?.id == R.id.currencyFragment){
            findNavController().popBackStack()
            val act = ListCurrentFragmentDirections.actionListCurrentFragmentToProfileFragment(userId)
            findNavController().navigate(act)
        }

    }

    companion object {
        private val TAG = "RecyclerViewFragment"
        fun newInstance(related: String, about: String): ListCommentFragment {
            val instance = ListCommentFragment()
            instance.related = related
            instance.about = about
            return instance
        }
    }

}




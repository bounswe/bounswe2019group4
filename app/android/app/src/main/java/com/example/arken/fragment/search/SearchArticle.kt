package com.example.arken.fragment.search

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.fragment.signup_login.LoginFragment
import com.example.arken.model.Article
import com.example.arken.util.ArticleAdapter
import com.example.arken.util.OnArticleClickListener
import com.example.arken.util.RetroClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import android.view.inputmethod.InputMethodManager
import androidx.navigation.fragment.findNavController
import com.example.arken.model.ListArticle

class SearchArticle : Fragment(), OnArticleClickListener {

    private lateinit var recyclerView: RecyclerView
    private var articleAdapter: ArticleAdapter? = null

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val rootView = inflater.inflate(R.layout.fragment_article_list, container, false)

        recyclerView = rootView.findViewById(R.id.article_recyclerView)
        if (articleAdapter == null) {
            articleAdapter = ArticleAdapter(this)
        }

        recyclerView.adapter = articleAdapter

        recyclerView.adapter?.notifyDataSetChanged()
        return rootView
    }

    override fun onArticleItemClicked(articleId: String) {

        val userCookie = activity!!.getSharedPreferences(
            LoginFragment.MY_PREFS_NAME,
            Context.MODE_PRIVATE
        ).getString("user_cookie", "")

        val call: Call<Article> = RetroClient.getInstance().apiService.getArticle(userCookie,articleId)

        call.enqueue(object : Callback<Article> {
            override fun onResponse(call: Call<Article>, response: Response<Article>) {
                if (response.isSuccessful) {
                    recyclerView.hideKeyboard()
                    val act = SearchFragmentDirections.actionSearchFragmentToArticleDetail(articleId!!)
                    findNavController().navigate(act)

                } else {
                    Toast.makeText(context, response.message(), Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Article>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })
    }

    fun setDataset(list: MutableList<Article>) {
        if (articleAdapter == null) {
            articleAdapter = ArticleAdapter(this)
        }
        articleAdapter!!.dataSet = list
        articleAdapter!!.notifyDataSetChanged()
    }
    fun View.hideKeyboard() {
        val imm = context.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        imm.hideSoftInputFromWindow(windowToken, 0)
    }

}
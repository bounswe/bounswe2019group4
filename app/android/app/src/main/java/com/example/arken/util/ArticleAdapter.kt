package com.example.arken.util

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.model.Article
import com.example.arken.model.ListArticle
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ArticleAdapter(

    val articleClickListener: OnArticleClickListener
) :
    RecyclerView.Adapter<ArticleAdapter.ArticleHolder>() {
    var dataSet: MutableList<Article> = mutableListOf()
var isAll:Boolean=false
    var totalPages: Int = 1
    var page: Int = 1
    class ArticleHolder(v: View) : RecyclerView.ViewHolder(v) {

        private val title: TextView

        init {
            title = v.findViewById(R.id.article_row_title)
        }

        fun bind(article: Article, clickListener: OnArticleClickListener) {
            title.text = article.title
            itemView.setOnClickListener {
                clickListener.onArticleItemClicked(article._id!!)
            }
        }
    }

    override fun onCreateViewHolder(viewGroup: ViewGroup, viewType: Int): ArticleHolder {

        val v = LayoutInflater.from(viewGroup.context)
            .inflate(R.layout.article_row, viewGroup, false)

        return ArticleHolder(v)
    }


    override fun onBindViewHolder(viewHolder: ArticleHolder, position: Int) {

        Log.d(TAG, "Element $position set.")
        val event = dataSet[position]
        viewHolder.bind(event, articleClickListener)
        if(isAll && position == dataSet.size - 1){
            newPage()
        }
    }//TODO listArticle modeli oluştur

    fun newPage() {
        page += 1
        if (page <= totalPages) {
            val call: Call<ListArticle> =
                RetroClient.getInstance().apiService.getArticles(page, 10)
            call.enqueue(object : Callback<ListArticle> {
                override fun onResponse(call: Call<ListArticle>, response: Response<ListArticle>) {
                    if (response.isSuccessful) {
                        val listArticle: ListArticle? = response.body()
                        if (listArticle != null) {
                            dataSet.addAll(listArticle.articles)
                            notifyDataSetChanged()
                        }
                    }
                }

                override fun onFailure(call: Call<ListArticle>, t: Throwable) {
                }
            })
        }
    }

    override fun getItemCount() = dataSet.size

    companion object {
        private val TAG = "CustomAdapter"
    }
}

interface OnArticleClickListener {
    fun onArticleItemClicked(id: String)
}
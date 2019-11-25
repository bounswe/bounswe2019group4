package com.example.arken.util

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.model.Article

class ArticleAdapter(var dataSet: MutableList<Article> = mutableListOf()) :
    RecyclerView.Adapter<ArticleAdapter.ArticleHolder>() {


    class ArticleHolder(v: View) : RecyclerView.ViewHolder(v) {

        private val title: TextView

        init {
            title = v.findViewById(R.id.article_row_title)
        }

        fun bind(article: Article) {
            title.text = article.title
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
        viewHolder.bind(event)
    }

    fun setData(articles: List<Article>) {
        dataSet = articles as MutableList<Article>
    }

    override fun getItemCount() = dataSet.size

    companion object {
        private val TAG = "CustomAdapter"
    }
}

interface OnArticleClickListener {
    fun onArticleItemClicked(id: String)
}
package com.example.arken.fragment;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.Switch;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;

import com.example.arken.R;

public class SignupFragment extends Fragment implements View.OnClickListener {
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_signup, container, false);

        Switch isTraderSwitch = view.findViewById(R.id.isTraderSwitch);
        final EditText ibanEditText = view.findViewById(R.id.ibanEditText);
        final EditText tcknEditText = view.findViewById(R.id.tcknEditText);
        ConstraintLayout layout = view.findViewById(R.id.signup_background);
        layout.setOnClickListener(this);
        isTraderSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                if(b){
                    ibanEditText.setVisibility(View.VISIBLE);
                    tcknEditText.setVisibility(View.VISIBLE);
                }
                else{
                    ibanEditText.setVisibility(View.GONE);
                    tcknEditText.setVisibility(View.GONE);
                }
            }
        });
        return view;
    }
    @Override
    public void onClick(View view) {
        if(view.getId()!=R.id.emailEditText && view.getId()!=R.id.ibanEditText &&
                view.getId()!=R.id.nameEditText && view.getId()!=R.id.passwordEditText &&
                view.getId()!=R.id.surnameEditText && view.getId()!=R.id.tcknEditText){
            InputMethodManager inputMethodManager = (InputMethodManager)getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
            inputMethodManager.hideSoftInputFromWindow(view.getWindowToken(), 0);

        }
    }
}
